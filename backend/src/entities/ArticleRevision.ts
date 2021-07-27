import { EntityOrRef, toRef } from "@/utils/orm";
import {
  Property, ManyToOne, PrimaryKey,
  Entity, ArrayType, IdentifiedReference, OneToOne, JsonType } from "@mikro-orm/core";
import { Author } from "yaarxiv-api/api/article/models";
import { ARTICLE_ABSTRACT_LENGTH_LIMIT } from "yaarxiv-api/api/article/upload";
import { Article } from "./Article";
import { UploadedFile } from "./UploadedFile";

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

  @Property({ length: ARTICLE_ABSTRACT_LENGTH_LIMIT })
  abstract: string

  @Property()
  category: string;

  @ManyToOne(() => UploadedFile, { nullable: false, wrappedReference: true })
  pdf: IdentifiedReference<UploadedFile>;

  @ManyToOne(() => Article, { nullable: false, wrappedReference: true, onDelete: "CASCADE" })
  article: IdentifiedReference<Article>;

  @OneToOne(() => Article, (a) => a.latestRevision, {
    nullable: true, owner: true, wrappedReference: true, onDelete: "CASCADE" })
  latestRevisionOf?: IdentifiedReference<Article>;

  @Property({ nullable: true })
  codeLink?: string = undefined;

  constructor(init: {
    id?: number;
    revisionNumber: number,
    time: Date,
    title: string,
    authors: Author[],
    keywords: string[],
    abstract: string,
    category: string,
    pdf: EntityOrRef<UploadedFile>,
    article: EntityOrRef<Article>,
    codeLink?: string,
  }) {
    if (init.id) this.id = init.id;
    this.revisionNumber = init.revisionNumber;
    this.time = init.time;
    this.title = init.title;
    this.authors = init.authors;
    this.keywords = init.keywords;
    this.abstract = init.abstract;
    this.category = init.category;
    this.pdf = toRef(init.pdf);
    this.article = toRef(init.article);
    this.codeLink = init.codeLink;

  }
}
