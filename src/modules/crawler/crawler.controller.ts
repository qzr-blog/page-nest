import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { CrawlerService } from './crawler.service'
import { CreateCrawlerDto } from './dto/create-crawler.dto'

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('/smzdm')
  create(@Body() createCrawlerDto: CreateCrawlerDto) {
    return this.crawlerService.getSmzdm(createCrawlerDto)
  }
}
