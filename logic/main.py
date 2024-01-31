from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__, template_folder='../template')

scaler = StandardScaler()

file_path_pred = '../data/data_pred.csv'
df_pred = pd.read_csv(file_path_pred)

X_pred = df_pred.drop(['id', 'name', 'diagnosis', 'timestamp'], axis=1)

file_path_train = '../data/data_train.csv'
df_train = pd.read_csv(file_path_train)

fitting_columns = df_train.columns.difference(['id', 'diagnosis'])
X_train = df_train[fitting_columns]
y_train = df_train['diagnosis']

X_train = scaler.fit_transform(X_train)

svm_model = SVC(kernel='linear', C=1, gamma='scale', random_state=42)
svm_model.fit(X_train, y_train)

upload_folder = '../uploads'
os.makedirs(upload_folder, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() == 'csv'

@app.route('/')
def home():
    return render_template('index.html')  

@app.route('/diagnosis')
def diagnosis():
    return render_template('diagnosis.html')

@app.route('/get_predictions', methods=['GET'])
def get_predictions():
    # Gabungkan DataFrame yang baru dengan yang lama
    combined_df = pd.concat([df_pred[df_pred['timestamp'].notna()], df_pred[df_pred['timestamp'].isna()]])

    # Pilih baris dengan timestamp terbaru
    latest_predictions = combined_df.sort_values(by='timestamp', ascending=False)[['id', 'name', 'diagnosis', 'timestamp']].to_dict(orient='records')

    return jsonify(latest_predictions)

@app.route('/submit_file', methods=['POST'])
def submit_file():
    global df_pred

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        df_submission = pd.read_csv(file_path)

        prediction_columns = df_pred.columns.difference(['id', 'name', 'diagnosis', 'timestamp'])
        X_submission = df_submission[prediction_columns]

        X_submission = scaler.transform(X_submission)

        diagnosis_result = svm_model.predict(X_submission)

        df_submission['diagnosis'] = diagnosis_result

        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        df_submission['timestamp'] = timestamp

        df_pred = pd.concat([df_pred, df_submission], ignore_index=True)

        updated_predictions = df_submission[['id', 'name', 'diagnosis', 'timestamp']].to_dict(orient='records')
        return jsonify(updated_predictions)

    else:
        return jsonify({'error': 'Invalid file format'})

@app.route('/history', methods=['GET'])
def history():
    # Tampilkan data yang baru saja diupload
    uploaded_data = df_pred[df_pred['timestamp'].notna() & (df_pred['timestamp'] == df_pred['timestamp'].max())][['id', 'name', 'diagnosis', 'timestamp']]
    return render_template('history.html', uploaded_data=uploaded_data.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True)
