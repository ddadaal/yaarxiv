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

  @Column()
  ownerSetVisibility: boolean = true;

  @Column()
  adminSetVisibility: boolean = true;

  @ManyToOne(() => User, (u) => u.articles, { onDelete: "CASCADE" })
  owner: User;

  @Column()
  ownerId: string;

}
