import { PrimaryGeneratedColumn, Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { ArticleRevision } from "./ArticleRevision";

@Entity()
export class Article {
  // increment is enough, since arxiv uses increment as well
  @PrimaryGeneratedColumn("increment")
  id: number;

  @OneToMany("ArticleRevision", "article", { cascade: true, onDelete: "CASCADE" })
  revisions: ArticleRevision[];

  @Column("datetime")
  createTime: Date;

  @Column("datetime")
  lastUpdateTime: Date;

  @Column()
  latestRevisionNumber: number;

}
