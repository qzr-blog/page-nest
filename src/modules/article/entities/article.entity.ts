import { Column, VersionColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class Article {
  // 自增 id
  @PrimaryGeneratedColumn()
  id: number

  // 标题
  @Column({ length: 255 })
  title: string

  // 具体内容
  @Column('text')
  content?: string

  // 简介
  @Column('text')
  description?: string

  // 创建时间
  @CreateDateColumn()
  createTime: Date

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date

  // 更新次数
  @VersionColumn()
  version: number

  // 软删除
  @Column({
    default: false
  })
  isDelete: boolean
}
