import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "mikro-orm";
import { Author } from "yaarxiv-api/article/models";
import { Article } from "./Article";

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

  @Property()
  authors: Author[];

  @Property()
  keywords: string[];

  @Property()
  abstract: string

  @Property()
  category: string;

  @Property()
  pdfLink: string;

  @ManyToOne()
  article: Article;

  @OneToOne(() => Article, (a) => a.latestRevision, { nullable: true })
  latestRevisionOf: Article | null;
}
