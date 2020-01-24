import {config} from "dotenv";
config();

import {NestFactory} from "@nestjs/core";
import {ValidationPipe} from "@nestjs/common";
import {AppModule} from "./AppModule";
import {config as envConfig} from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(Number(envConfig.PORT));

}

bootstrap();
