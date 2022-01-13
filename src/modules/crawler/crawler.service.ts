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
        title: '全品类',
        url: 'https://faxian.smzdm.com/h2s0t0f0c1p1/#filter-block'
      },
      {
        title: '电脑配件榜',
        url: 'https://www.smzdm.com/fenlei/diannaopeijian/h3c4s0f0t0p1/#feed-main/'
      },
      {
        title: 'ipad air4',
        url: 'https://search.smzdm.com/?c=faxian&s=ipad+air4&f_c=zhi&min_price=3000&max_price=6000&v=b'
      }
    ]

    const promiseList = await Promise.allSettled(promiseArr.map((x) => this.httpService.get(x.url)))
    const promiseVal = await Promise.allSettled(promiseList.map((x: any) => lastValueFrom(x.value)))

    let finallyArr = []

    promiseVal.forEach((item, index) => {
      const { title, url } = promiseArr[index]
      let goodsArr

      const $ = cheerio.load(String((<any>item).value.data))

      if (url.indexOf('search.smzdm.com') !== -1) {
        // 搜索页
        goodsArr = getSearchGoods($)
      } else if (url.indexOf('/fenlei/') !== -1) {
        // 排行榜页
        goodsArr = getFenleiGoods($)
      } else if (url.indexOf('faxian.smzdm.com') !== -1) {
        // 发现页
        goodsArr = getFaxianGoods($)
      }

      finallyArr.push({
        title,
        content: goodsArr
      })
    })

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

    function getSearchGoods($) {
      let resArr = []
      $('.feed-row-wide').each((i, e) => {
        const chance = getChance($(e))
        if (chance.chance !== 0) {
          resArr.push({
            title: $(e).find('.feed-block-title .feed-nowrap').text(),
            price: $(e).find('.feed-block-title .z-highlight').text().trim(),
            chance: chance.chance,
            url: $(e).find('.feed-block-title a').attr('href'),
            collcet: $(e).find('.z-feed-foot-l .z-group-data span').first().text(),
            comment: $(e).find('.z-feed-foot-l .z-group-data span').last().text(),
            img: `https://images.weserv.nl/?url=https:${$(e).find('.z-feed-img img').attr('src')}`,
            down: chance.down,
            up: chance.up
          })
        }
      })
      return resArr
    }

    function getFenleiGoods($) {
      let resArr = []
      $('.feed-row-wide').each((i, e) => {
        const chance = getChance($(e))
        if (chance.chance !== 0) {
          resArr.push({
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
        }
      })
      return resArr
    }

    function getFaxianGoods($) {
      let resArr = []
      $('.feed-list-col .J_feed_za').each((i, e) => {
        resArr.push({
          title: $(e).find('.feed-ver-title a').text(),
          price: $(e).find('.z-highlight').text().trim(),
          url: $(e).find('.feed-block-title a').attr('href'),
          comment: $(e).find('.z-group-data').last().text(),
          img: `https://images.weserv.nl/?url=${$(e).find('.feed-ver-pic img').attr('src')}`,
          up: $(e).find('.unvoted-wrap').text()
        })
      })
      return resArr
    }
  }
}
