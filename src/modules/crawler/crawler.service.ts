import { Injectable } from '@nestjs/common'
import { CreateCrawlerDto } from './dto/create-crawler.dto'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import cheerio from 'cheerio'

@Injectable()
export class CrawlerService {
  constructor(private httpService: HttpService) {}

  async getSmzdm(createCrawlerDto: CreateCrawlerDto) {
    const promiseArr = [
      {
        title: '电脑配件榜',
        url: 'https://www.smzdm.com/fenlei/diannaopeijian/h3c4s0f0t0p1/#feed-main/'
      },
      {
        title: 'ipad air4',
        url: 'https://search.smzdm.com/?c=faxian&s=ipad+air4&f_c=zhi&min_price=3000&max_price=6000&v=b'
      }
    ]

    // const promiseList = Promise.allSettled(promiseArr.map((x) => this.httpService.get(x.url)))

    const res = await this.httpService.get('https://www.smzdm.com/fenlei/diannaopeijian/h3c4s0f0t0p1/#feed-main/')
    const response = await lastValueFrom(res)

    const res1 = await this.httpService.get('https://search.smzdm.com/?c=faxian&s=ipad+air4&f_c=zhi&min_price=3000&max_price=6000&v=b')
    const response1 = await lastValueFrom(res1)

    let finallyArr = []

    for (const item of [response, response1]) {
      let goodsArr = []

      const $ = cheerio.load(String(item.data))
      $('.feed-row-wide').each((i, e) => {
        const chance = getChance($(e))
        if (chance.chance === 0) return false

        goodsArr.push({
          title: $(e).find('.feed-block-title a').text(),
          price: $(e).find('.z-highlight a').text().trim(),
          chance: chance.chance,
          url: $(e).find('.feed-block-title a').attr('href'),
          collcet: $(e).find('.z-feed-foot-l .z-group-data span').first().text(),
          comment: $(e).find('.z-feed-foot-l .z-group-data span').last().text(),
          img: `https://images.weserv.nl/?url=https:${$(e).find('.z-feed-img img').attr('src')}`,
          down: chance.down,
          up: chance.up
        })
      })

      finallyArr.push({
        title: '电脑配件榜单',
        content: goodsArr
      })
    }

    return finallyArr

    function getChance(e) {
      const up = Number(e.find('.price-btn-up .unvoted-wrap span').text())
      const down = Number(e.find('.price-btn-down .unvoted-wrap span').text())
      let chance = 0

      if (up + down !== 0) {
        chance = Math.floor((up / (up + down)) * 100)
      }

      return {
        chance,
        up,
        down
      }
    }
  }
}
