import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {//1 bootstrap funksiyasi ishga tushadi
  const app = await NestFactory.create(AppModule);//meth chaqirib  appmoduleni arg ber  app=> obj nestjs+ express qorishmasi 
 app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT_API ?? 3000);//app.listen ga tegshli 
}
bootstrap();
 