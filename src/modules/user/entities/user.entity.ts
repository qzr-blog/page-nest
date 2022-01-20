import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, VersionColumn } from 'typeorm'

@Entity()
export class User {
  // 主键id uuid通用唯一识别码
  @PrimaryGeneratedColumn('uuid')
  id: number

  // 用户名
  @Column({ length: 100 })
  username: string

  // 创建时间
  @CreateDateColumn()
  createTime: Date

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date

  // 软删除
  @Column({
    default: false
  })
  isDelete: boolean

  // 邮箱
  @Column()
  email: string

  // 用户角色
  @Column('simple-enum', { enum: ['root', 'author', 'visitor'] })
  role: string

  // 更新次数
  @VersionColumn()
  version: number

  // 昵称
  @Column('text')
  nickname: string

  // 手机号
  @Column('text')
  mobile: string

  // 加密后的密码
  @Column('text', { select: false })
  password: string

  // 加密盐
  @Column('text', { select: false })
  salt: string
}
