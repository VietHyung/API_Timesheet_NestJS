import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: configService.get('db_host'),
            port: configService.get('db_port'),
            username: configService.get('db_username'),
            password: configService.get('db_password'),
            database: configService.get('db_database'),
            entities: ['dist/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true

        };
    }
}

export const TypeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],

    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.
        getOrmConfig(configService),

    inject: [ConfigService]
};
