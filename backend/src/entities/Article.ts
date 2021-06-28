import { Entity, Property, OneToMany, ManyToOne, PrimaryKey, Cascade } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";

@Entity()
export class Article {
  // increment is enough, since arxiv uses increment as well
  @PrimaryKey()
  id: number;

  @OneToMany(() => ArticleRevision, (r) => r.article, { cascade: [Cascade.ALL]})
  revisions: ArticleRevision[];

  @Property("datetime")
  createTime: Date;

  @Property("datetime")
  lastUpdateTime: Date;

  @Property()
  latestRevisionNumber: number;

  @Property()
  ownerSetPublicity: boolean = true;

  @Property()
  adminSetPublicity: boolean = true;

  @ManyToOne(() => User)
  owner: User;

  @Property()
  ownerId: string;

}
