
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        return {
            secret: configService.get('JWT_SECRET_KEY'),
            signOptions: { expiresIn: '1000s' },
        }
    },
    inject: [ConfigService]
}
