import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AbilitiesGuard } from './casl/ability.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

}
bootstrap();
