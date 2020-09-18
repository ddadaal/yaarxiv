import { Cascade, Entity, JsonType, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
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

  @Property({ type: JsonType })
  authors: Author[];

  @Property()
  keywords: string[];

  @Property()
  abstract: string

  @Property()
  category: string;

  @ManyToOne(() => PdfUpload, { cascade: [Cascade.ALL]})
  pdf: PdfUpload;

  @ManyToOne(() => Article)
  article: Article;
}
