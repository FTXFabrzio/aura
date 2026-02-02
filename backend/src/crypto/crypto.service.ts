import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'node:crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    let masterKey = this.configService.get<string>('AURA_MASTER_KEY');
    
    if (!masterKey) {
      console.warn('AURA_MASTER_KEY not found. Generating a temporary 32-byte hex key.');
      masterKey = crypto.randomBytes(32).toString('hex');
    }
    
    // Si es hex y tiene 64 chars, son 32 bytes
    if (masterKey.length === 64) {
      this.key = Buffer.from(masterKey, 'hex');
    } else {
      // Fallback: derivar clave de 32 bytes de cualquier string
      this.key = crypto.scryptSync(masterKey, 'aura-salt', 32);
    }
  }


  encrypt(text: string): { encryptedData: string; iv: string } {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    // Auth tag included in encrypted data for GCM
    return {
      encryptedData: `${authTag}:${encrypted}`,
      iv: iv.toString('hex')
    };
  }

  decrypt(encryptedData: string, ivHex: string): string {
    const [authTagHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
