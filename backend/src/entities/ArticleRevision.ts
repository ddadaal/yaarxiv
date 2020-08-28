import { Entity } from "typeorm/decorator/entity/Entity";
import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "yaarxiv-api/article/models";
import { Article } from "./Article";

@Entity()
export class ArticleRevision {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  revisionNumber: number;

  @Column("datetime")
  time: Date;

  @Column()
  title: string;

  @Column("simple-json")
  authors: Author[];

  @Column("simple-array")
  keywords: string[];

  @Column("varchar", { length: 500 })
  abstract: string

  @Column()
  category: string;

  @Column()
  pdfLink: string;

  @ManyToOne(() => Article, (a) => a.revisions, { onDelete:"CASCADE" })
  article: Article;
}
