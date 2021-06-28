import { Property, ManyToOne, PrimaryKey, Entity, ArrayType } from "@mikro-orm/core";
import { Author } from "yaarxiv-api/article/models";
import { Article } from "./Article";
import { PdfUpload } from "./PdfUpload";

@Entity()
export class ArticleRevision {
  @PrimaryKey()
  id: number;

  @Property()
  revisionNumber: number;

  @Property()
  time: Date;

  @Property()
  title: string;

  @Property({ type: ArrayType })
  authors: Author[];

  @Property({ type: ArrayType })
  keywords: string[];

  @Property({ length: 500 })
  abstract: string

  @Property()
  category: string;

  @ManyToOne(() => PdfUpload)
  pdf: PdfUpload;

  @ManyToOne(() => Article)
  article: Article;

  @Property()
  articleId: number;

  @Property({ nullable: true })
  codeLink?: string = undefined;
}
