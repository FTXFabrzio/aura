import { ConfigService } from '@nestjs/config';
import * as schema from './schema';
export declare const DRIZZLE_PROVIDER = "DRIZZLE_PROVIDER";
export declare const DrizzleProvider: {
    provide: string;
    useFactory: (configService: ConfigService) => import("drizzle-orm/libsql").LibSQLDatabase<typeof schema> & {
        $client: import("@libsql/client", { with: { "resolution-mode": "import" } }).Client;
    };
    inject: (typeof ConfigService)[];
};
