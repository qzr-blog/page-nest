import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { IdDTO } from './dto/id.dto'

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Article } from './entities/article.entity'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = new Article()
    for (let key in createArticleDto) {
      article[key] = createArticleDto[key]
    }
    const result = await this.articleRepository.save(article)

    return result
  }

  async findAll() {
    const getList = this.articleRepository
      .createQueryBuilder('article')
      .where({ isDelete: false })
      .select(['article.id', 'article.title', 'article.description', 'article.createTime', 'article.updateTime'])

    const list = await getList
    return list
  }

  async findOne(id: number) {
    const articleDetial = await this.articleRepository.createQueryBuilder('article').where('article.id = :id', { id }).getOne()

    if (!articleDetial) {
      throw new NotFoundException('找不到文章')
    }
    return articleDetial
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    let articleToUpdate = await this.articleRepository.findOne({ id })
    articleToUpdate.title = updateArticleDto.title
    articleToUpdate.description = updateArticleDto.description
    articleToUpdate.content = updateArticleDto.content
    const result = await this.articleRepository.save(articleToUpdate)
    return result
  }

  async remove(id: number) {
    let articleToUpdate = await this.articleRepository.findOne({ id })
    articleToUpdate.isDelete = true
    const result = await this.articleRepository.save(articleToUpdate)
    return result
  }
}
