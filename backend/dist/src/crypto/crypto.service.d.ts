import { ConfigService } from '@nestjs/config';
export declare class CryptoService {
    private configService;
    private readonly algorithm;
    private readonly key;
    constructor(configService: ConfigService);
    encrypt(text: string): {
        encryptedData: string;
        iv: string;
    };
    decrypt(encryptedData: string, ivHex: string): string;
}
