import { ConfigService } from '@nestjs/config';
export declare class CryptoService {
    private configService;
    private readonly masterKey;
    private readonly algorithm;
    constructor(configService: ConfigService);
    encrypt(plaintext: string): {
        ciphertext: string;
        iv: string;
    };
    decrypt(encryptedData: string, ivHex: string): string;
}
