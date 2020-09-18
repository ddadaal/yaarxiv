import { Entity, OneToMany, ManyToOne, PrimaryKey, Cascade, Property, Collection } from "@mikro-orm/core";
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

  @Property()
  latestRevisionNumber: number;

  @ManyToOne(() => User)
  owner: User;

}
