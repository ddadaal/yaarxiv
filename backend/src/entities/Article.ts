import {
  Entity, Property, OneToMany, ManyToOne,
  PrimaryKey, OneToOne, IdentifiedReference, Collection } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User, UserRole } from "./User";

@Entity()
export class Article {
  // increment is enough, since arxiv uses increment as well
  @PrimaryKey()
  id: number;

  @OneToMany(() => ArticleRevision, (r) => r.article)
  revisions = new Collection<ArticleRevision>(this);

  @Property()
  createTime: Date;

  @Property()
  lastUpdateTime: Date;

  @OneToOne(() => ArticleRevision, (r) => r.latestRevisionOf, {
    wrappedReference: true })
  latestRevision: IdentifiedReference<ArticleRevision>;

  @Property()
  ownerSetPublicity: boolean = true;

  @Property()
  adminSetPublicity: boolean = true;

  @ManyToOne(() => User, { wrappedReference: true, onDelete: "CASCADE" })
  owner: IdentifiedReference<User>;

  // if the logged in user is the owner or an admin,
  // then it can get the article even if the article is not public,
  checkAccessibility(user: User | undefined) {
    if (!this.adminSetPublicity || !this.ownerSetPublicity) {
      if (!user || (!(user.role === UserRole.Admin || this.owner.id === user.id))) {
        return false;
      }
    }
    return true;
  }
}
