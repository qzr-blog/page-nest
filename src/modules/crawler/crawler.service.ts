import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common'
import { CreateCrawlerDto } from './dto/create-crawler.dto'
import { HttpService } from '@nestjs/axios'
import { Cache } from 'cache-manager'
import { Cron } from '@nestjs/schedule'

import getSmzdm from './script/getSmzdm'

@Injectable()
export class CrawlerService {
  constructor(private httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * 每20分钟获取一次smzdm信息
   */
  @Cron('0 */20 * * * *')
  async getSmzdmCron() {
    const smzdmArr = await getSmzdm.call(this)
    await this.cacheManager.set('smzdmArr', smzdmArr, { ttl: 0 })
  }

  /**
   * 每天0点清空推送缓存信息
   */
  @Cron('0 0 0 * * *')
  async clearPushStr() {
    await this.cacheManager.set('pushStr', ``, { ttl: 0 })
  }

  async getSmzdm() {
    // this.getSmzdmCron()
    const smzdmArr = await this.cacheManager.get('smzdmArr')
    return smzdmArr
  }
}
