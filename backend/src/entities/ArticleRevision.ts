import { Entity } from "typeorm/decorator/entity/Entity";
import { Column, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Author } from "yaarxiv-api/article/models";
import { Article } from "./Article";
import { PdfUpload } from "./PdfUpload";

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

  @ManyToOne(() => PdfUpload, (p) => p.articleRevisions, { cascade: true, onDelete: "CASCADE" })
  pdf: PdfUpload;

  @ManyToOne(() => Article, (a) => a.revisions, { onDelete:"CASCADE" })
  article: Article;

  @Column()
  articleId: number;
}
