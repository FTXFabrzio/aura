import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

@Injectable()
export class CryptoService {
  private readonly masterKey: Buffer;
  private readonly algorithm = 'aes-256-gcm';

  constructor(private configService: ConfigService) {
    const keyStr = this.configService.get<string>('AURA_MASTER_KEY');
    if (!keyStr || keyStr.length !== 64) {
      throw new Error('AURA_MASTER_KEY must be a 64-character hex string (32 bytes)');
    }
    this.masterKey = Buffer.from(keyStr, 'hex');
  }

  encrypt(plaintext: string): { ciphertext: string; iv: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
    
    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    // Result is Ciphertext + Tag
    return {
      ciphertext: ciphertext + tag,
      iv: iv.toString('hex'),
    };
  }

  decrypt(encryptedData: string, ivHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    // The tag is the last 16 bytes (32 hex chars)
    const tagLength = 32;
    const tagHex = encryptedData.slice(-tagLength);
    const ciphertextHex = encryptedData.slice(0, -tagLength);
    
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
