import {
  Property, ManyToOne, PrimaryKey,
  Entity, ArrayType, IdentifiedReference, OneToOne, Cascade, JsonType } from "@mikro-orm/core";
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

  @Property({ type: ArrayType })
  keywords: string[];

  @Property({ length: 500 })
  abstract: string

  @Property()
  category: string;

  @ManyToOne(() => PdfUpload)
  pdf: PdfUpload;

  @ManyToOne(() => Article, { nullable: false, wrappedReference: true, cascade: [Cascade.ALL]})
  article: IdentifiedReference<Article>;

  @OneToOne(() => Article, (a) => a.latestRevision, { nullable: true, wrappedReference: true, cascade: [Cascade.ALL]})
  latestRevisionOf?: IdentifiedReference<Article>;

  @Property({ nullable: true })
  codeLink?: string = undefined;
}
