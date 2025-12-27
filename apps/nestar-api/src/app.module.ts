import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule} from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { DatabaseModule } from './database/database.module';
import { ComponentsModule } from './components/components.module';
 
@Module({
	imports: [
    ConfigModule.forRoot(),//environment variable bn ishlaydigon 
    GraphQLModule.forRoot({//graph ql texnalaogiyasini hosil. qilib berayabdi
    driver: ApolloDriver,
    playground: true,
    uploads: false,
    autoSchemaFile: 'schema.gql',
  }),
  ComponentsModule,
  DatabaseModule //loyihamizning asosiy mantigi uchun hizmat qiladigon module imports orqali integratsiyasini qabul qilib olamiz
], 
	controllers: [AppController],
	providers: [AppService, AppResolver],//ikkisi bolmasa ham bolaverad test uchun tepasidagi ham
})
export class AppModule {}
 