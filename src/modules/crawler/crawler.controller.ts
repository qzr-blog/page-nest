import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CrawlerService } from './crawler.service'
import { CreateCrawlerDto } from './dto/create-crawler.dto'

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('/smzdm')
  getSmzdm() {
    return this.crawlerService.getSmzdm()
  }
}
