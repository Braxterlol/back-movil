export interface IEcryptService {
    authPassword(word: string, passwordEncode: string): boolean;
  }