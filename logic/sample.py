# Import library
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from datetime import datetime


# Load data latih dari file CSV
file_path_train = '../data/data_train.csv'
df_train = pd.read_csv(file_path_train)

# Tampilkan beberapa baris pertama dari data latih
print(df_train.head())

# Pisahkan atribut/fitur (X_train) dan label (y_train)
X_train = df_train.drop('diagnosis', axis=1)
y_train = df_train['diagnosis']

# Bagi data latih menjadi data pelatihan dan data pengujian
X_train, X_val, y_train, y_val = train_test_split(X_train, y_train, test_size=0.2, random_state=42, stratify=y_train)

# Normalisasi data
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_val = scaler.transform(X_val)

# Inisialisasi model SVM
svm_model = SVC(kernel='linear', C=1, gamma='scale', random_state=42)

# Latih model
svm_model.fit(X_train, y_train)

# Lakukan prediksi pada data pengujian
y_pred_val = svm_model.predict(X_val)

# Evaluasi model pada data pengujian
accuracy_val = accuracy_score(y_val, y_pred_val)
conf_matrix_val = confusion_matrix(y_val, y_pred_val)
classification_rep_val = classification_report(y_val, y_pred_val)

# Tampilkan hasil evaluasi pada data pengujian
print(f'Accuracy on Validation Data: {accuracy_val:.4f}')
print('Confusion Matrix on Validation Data:')
print(conf_matrix_val)
print('Classification Report on Validation Data:')
print(classification_rep_val)

# Load data pengujian dari file CSV
file_path_test = '../data/data_tes.csv'
df_test = pd.read_csv(file_path_test)

# Pisahkan atribut/fitur (X_test) dan hapus kolom 'name'
X_test = df_test.drop('name', axis=1)

# Tampilkan hasil prediksi pada data pengujian
print("\nHasil Prediksi pada Data Pengujian:")
print(X_test[['id']])  # Tampilkan ID untuk identifikasi

# Normalisasi data pengujian menggunakan scaler yang sama yang digunakan pada data latih
X_test = scaler.transform(X_test)


# Lakukan prediksi pada data pengujian
y_pred_test = svm_model.predict(X_test)

# Tambahkan kolom 'diagnosis' ke DataFrame hasil prediksi
df_test['diagnosis'] = y_pred_test
df_test['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')


# Tampilkan hasil prediksi pada data pengujian
print(df_test[['id', 'name', 'diagnosis', 'timestamp']])

# Simpan hasil prediksi pada data pengujian ke file CSV
file_path_pred = '../data/data_pred.csv'
df_test.to_csv(file_path_pred, index=False)

print(f"\nHasil prediksi pada data pengujian disimpan ke file '{file_path_pred}'")