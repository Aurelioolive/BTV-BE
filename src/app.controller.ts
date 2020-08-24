import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Get twitter list
  @Get('/twitter-list/:hashtag')
  async getHello(@Param('hashtag') hashtag:string): Promise<any> {
    return this.appService.getTwitterList(hashtag);
  }
}
