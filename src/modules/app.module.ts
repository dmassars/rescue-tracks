import { Module } from '@nestjs/common';

import { EventPapersModule } from "./event-papers/event-papers.module";

import { AppController } from './app.controller';

@Module({
  modules: [EventPapersModule],
  controllers: [AppController],
  components: [],
})
export class ApplicationModule {}
