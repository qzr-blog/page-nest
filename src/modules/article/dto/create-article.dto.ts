import { IsNotEmpty } from 'class-validator'

export class CreateArticleDto {
  @IsNotEmpty({ message: '请输入文章标题' })
  title?: string // 标题

  @IsNotEmpty({ message: '请输入文章内容' })
  content?: string // 内容

  @IsNotEmpty({ message: '请输入文章简介' })
  description?: string // 简介
}
