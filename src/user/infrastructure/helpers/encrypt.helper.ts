import bcrypt from 'bcrypt';
import { EncryptService } from '../../application/services/encrypt.service';

export class EncryptHelper implements EncryptService {
     
  endecodePassword(password: string): string {
      const pass = bcrypt.hashSync(password, 10);
      return pass;
  }
}