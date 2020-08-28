import { PrimaryGeneratedColumn, Entity, Column, OneToMany, ManyToOne } from "typeorm";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";

@Entity()
export class Article {
  // increment is enough, since arxiv uses increment as well
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany(() => ArticleRevision, (r) => r.article, { cascade: true, onDelete: "CASCADE" })
  revisions: ArticleRevision[];

  @Column("datetime")
  createTime: Date;

  @Column("datetime")
  lastUpdateTime: Date;

  @Column()
  latestRevisionNumber: number;

  @ManyToOne(() => User, (u) => u.articles)
  owner: User;

  @Column()
  ownerId: string;

}
