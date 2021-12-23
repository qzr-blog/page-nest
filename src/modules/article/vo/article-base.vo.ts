// VO其实不是必须的，参考了Java朋友的说法，dto 是指Data Transfer Object，VO是指 View Object，这里主要是用来提供给 Swagger 做返回数据的显示用，顺便贴到接口返回里面规范返回数据体用的。就是说如果没有VO的话，swagger 生成出来的时候其实是看不到返回数据的，必须要去调用才知道返回数据是什么样子

import { ApiProperty } from '@nestjs/swagger'

class ArticleBaseItem {
  @ApiProperty({ description: '文章id', example: 1 })
  id: number

  @ApiProperty({ description: '创建时间', example: '2021-07-03' })
  createTime: Date

  @ApiProperty({ description: '更新时间', example: '2021-07-03' })
  updateTime: Date

  @ApiProperty({ description: '文章标题', example: '文章标题' })
  title: string

  @ApiProperty({ description: '文章描述', example: '文章描述' })
  description: string
}

export class ArticleListItem extends ArticleBaseItem {}

export class ArticleInfoItem extends ArticleBaseItem {
  @ApiProperty({ description: '文章内容', example: '文章内容' })
  content: string
}
