import { DATETIME_TYPE, EntityOrRef, toRef } from "@/utils/orm";
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

  @Property({ columnType: DATETIME_TYPE })
  createTime: Date;

  @Property({ columnType: DATETIME_TYPE })
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

  @ManyToOne(() => User, { nullable: true, wrappedReference: true, onDelete: "CASCADE" })
  retractedBy?: IdentifiedReference<User>;

  @Property({ columnType: DATETIME_TYPE, nullable: true })
  retractTime?: Date;

  get isRetracted() {
    return this.retractTime !== undefined;
  }

  retract(by: EntityOrRef<User>, time: Date) {
    this.retractedBy = toRef(by);
    this.retractTime = time;
  }

  // if the logged in user is the owner or an admin,
  // then it can get the article even if the article is not public,
  checkAccessibility(user: Pick<User, "role" | "id"> | undefined) {
    if (!this.adminSetPublicity || !this.ownerSetPublicity) {
      if (!user || (!(user.role === UserRole.Admin || this.owner.id === user.id))) {
        return false;
      }
    }
    return true;
  }

  constructor(init: {
    id?: number,
    createTime: Date,
    lastUpdateTime: Date,
    owner: EntityOrRef<User>,
    latestRevision?: EntityOrRef<ArticleRevision>,
    revisions?: EntityOrRef<ArticleRevision>[],
    retractTime?: Date,
  }) {
    if (init.id) this.id = init.id;
    this.createTime = init.createTime;
    this.lastUpdateTime = init.lastUpdateTime;
    this.retractTime = init.retractTime;
    if (init.latestRevision) this.latestRevision = toRef(init.latestRevision);
    this.owner = toRef(init.owner);
    if(init.revisions) {
      this.revisions.add(...init.revisions);
    }
  }
}
