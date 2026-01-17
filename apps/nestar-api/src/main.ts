import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';
async function bootstrap() {
	//1 bootstrap funksiyasi ishga tushadi
	const app = await NestFactory.create(AppModule); //  app=> INSTANCE obj nestjs+ express qorishmasi
	app.useGlobalPipes(new ValidationPipe()); // DTO data transfer method object  1.global 2.method 3.RESOOLVER  Backedn  kirdi chiqdini filter qilib beradi
	app.useGlobalInterceptors(new LoggingInterceptor()); //LOGGING standards req res  backendga chiqa
	app.enableCors({ origin: true, credentials: true });// DOMAIN ga ruhsat berrayabmiz 
//NESTJS MANTIQ ^^^^
// EXPRESS MANTIGI 
	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 }));
	app.use('/uploads', express.static('./uploads')); //uploadni static folder sifatida ochib berdik

	await app.listen(process.env.PORT_API ?? 3000); //app.listen ga tegshli
}
bootstrap();

//pipe 3 xil integratsiya qilsa boladi
// 1.method oziga  2.global 3.resolver miqyosida


//USE MIDDLEVERE DESIOGN PATTERN 
