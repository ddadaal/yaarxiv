import { EntityOrRef, toRef } from "@/utils/orm";
import {
  Property, ManyToOne, PrimaryKey,
  Entity, IdentifiedReference, OneToOne } from "@mikro-orm/core";
import { ArticleInfoMultiLangPart, Author, TITLE_MAX_LENGTH } from "yaarxiv-api/api/article/models";
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

  @Property({ type: "json" })
  authors: Author[];

  @Property({ nullable: true, length: TITLE_MAX_LENGTH })
  cnTitle?: string;

  @Property({ type: "json", nullable: true })
  cnKeywords?: string[];

  @Property({ nullable: true, length: TITLE_MAX_LENGTH })
  enTitle?: string;

  @Property({ type: "json", nullable: true })
  enKeywords?: string[];

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
    authors: Author[],
    abstract: string,
    category: string,
    pdf: EntityOrRef<UploadedFile>,
    article: EntityOrRef<Article>,
    codeLink?: string;
  } & ArticleInfoMultiLangPart) {
    if (init.id) this.id = init.id;
    ["cnTitle", "cnKeywords", "enTitle", "enKeywords"]
      .forEach((x) => {
        if (x in init) {
          this[x] = init[x];
        }
      });
    this.revisionNumber = init.revisionNumber;
    this.time = init.time;
    this.authors = init.authors;
    this.abstract = init.abstract;
    this.category = init.category;
    this.pdf = toRef(init.pdf);
    this.article = toRef(init.article);
    this.codeLink = init.codeLink;

  }
}
