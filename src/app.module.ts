import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UasController } from './uas/uas.controller';
import { UasService } from './uas/uas.service';

@Module({
  imports: [],
  controllers: [AppController, UasController],
  providers: [AppService, UasService],
})
export class AppModule {}
