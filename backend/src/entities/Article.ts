import {
  Entity, Property, OneToMany, ManyToOne,
  PrimaryKey, Cascade, OneToOne, IdentifiedReference, Collection } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";

@Entity()
export class Article {
  // increment is enough, since arxiv uses increment as well
  @PrimaryKey()
  id: number;

  @OneToMany(() => ArticleRevision, (r) => r.article, { cascade: [Cascade.ALL]})
  revisions = new Collection<ArticleRevision>(this);

  @Property()
  createTime: Date;

  @Property()
  lastUpdateTime: Date;

  @OneToOne(() => ArticleRevision, (r) => r.latestRevisionOf, { cascade: [Cascade.ALL], wrappedReference: true })
  latestRevision: IdentifiedReference<ArticleRevision>;

  @Property()
  ownerSetPublicity: boolean = true;

  @Property()
  adminSetPublicity: boolean = true;

  @ManyToOne(() => User)
  owner: IdentifiedReference<User>;
}
