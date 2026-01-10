import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule} from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { ComponentsModule } from './components/components.module';
import { T } from './libs/types/common';
 
@Module({
	imports: [//property
    ConfigModule.forRoot(),//environment variable bn ishlaydigon .env
    GraphQLModule.forRoot({//graph ql texnalaogiyasini hosil. qilib berayabdi
    driver: ApolloDriver,//confugratsiyalarini taqdim qildik
    playground: true,// documentationni korish un  yoqib qoyilggan 
    uploads: false,//graphql nikini iahltmymi  ozmz iahltamz 
    autoSchemaFile: true,// Postmanda schema file auto chiqarib beerayabdi shuning un 
    formatError: (error: T) => {
      const graphQLFormattedError = {
        code: error?.extensions.code,
        message: 
         error?.extensions?.exception?.response?.message ||   error?.extensions?.response?.message || error?.message,
      };
      console.log("GRAPHQL GLOBAl ERROR:", graphQLFormattedError);
      return graphQLFormattedError;
    }
  }),
  ComponentsModule,  // HHTP qolgan moduleni birlashtradi (koprik) 
  DatabaseModule // TCP loyihamizning asosiy mantigi uchun hizmat qiladigon module imports orqali integratsiyasini qabul qilib olamiz
], 
	controllers: [AppController], //rest api 
	providers: [AppService, AppResolver],// graphql api ikkisi bolmasa ham bolaverad test uchun tepasidagi ham
})
export class AppModule {}//MODULE DECORETOR ENGREDIENT
 
  // imports controllers providers    ==> property
//ConfigModule GraphQLModule ==> bular package  external package  foprRoot() ==> static method ildiz ot 
// ComponentsModule DatabaseModule => file package

//NESTJS ning Asosiy INGREDIENTI 

