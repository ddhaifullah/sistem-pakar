
import * as bcrypt from 'bcrypt';

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}