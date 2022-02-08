import { lastValueFrom } from 'rxjs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/RelativeTime'
import 'dayjs/locale/zh-cn'

const txKey = 'cad9aba47305ebce4b84d90281b1f543'

export default async function () {
  let str = 'to 蝶宝 \n '

  str += `${await getCph.call(this)} \n `

  str += `${await getHoliday.call(this)}`

  return str
}

/**
 * 获取彩虹屁
 */
async function getCph() {
  const chpRes = await this.httpService.get(`http://api.tianapi.com/caihongpi/index?key=${txKey}`)
  const chpResponse: any = await lastValueFrom(chpRes)
  return chpResponse.data.newslist[0].content
}

/**
 * 获取节假日信息
 */
async function getHoliday() {
  dayjs.locale('zh-cn')
  const now = dayjs()
  const nowString = now.format('YYYY-MM-DD')
  let str = `今天是${nowString} 然宝提醒你`

  const jjrRes = await this.httpService.get(`http://api.tianapi.com/jiejiari/index?key=${txKey}&date=${nowString}&type=1`)
  const jjrResponse: any = await lastValueFrom(jjrRes)

  const newslist = jjrResponse.data.newslist

  for (const item of newslist) {
    const { wage } = item
    let holidayFirst = ''
    if (wage.includes('|')) holidayFirst = wage.split('|')[0]
    else holidayFirst = wage

    dayjs.extend(relativeTime)
    item.until = dayjs(holidayFirst).diff(now, 'day')
    if (item.until < 0) continue

    str += `距离${item.name}还有：${item.until}天 \n `
  }
  return str
}
