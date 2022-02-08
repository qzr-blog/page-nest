import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common'
import { CreateCrawlerDto } from './dto/create-crawler.dto'
import { HttpService } from '@nestjs/axios'
import { Cache } from 'cache-manager'
import { Cron } from '@nestjs/schedule'

import getSmzdm from './script/getSmzdm'

@Injectable()
export class CrawlerService {
  constructor(private httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @Cron('0 0/20 * * *')
  async getSmzdmCron() {
    const finallyArr = await getSmzdm.call(this)
    await this.cacheManager.set('finallyArr', finallyArr, { ttl: 0 })
  }

  async getSmzdm() {
    const finallyArr = await this.cacheManager.get('finallyArr')
    return finallyArr
  }
}
