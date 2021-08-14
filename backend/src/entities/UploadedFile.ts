import { EntityOrRef, toRef } from "@/utils/orm";
import { Entity, Property, OneToMany,
  ManyToOne, PrimaryKey, IdentifiedReference, Collection } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";

@Entity()
export class UploadedFile {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE", wrappedReference: true })
  user: IdentifiedReference<User>;

  @Property()
  filePath: string;

  @OneToMany(() => ArticleRevision, (r) => r.script)
  articleRevisions = new Collection<ArticleRevision>(this);

  constructor(init: {
    id?: number;
    user: EntityOrRef<User>,
    filePath: string,
  }) {
    if (init.id) {
      this.id = init.id;
    }
    this.user = toRef(init.user);
    this.filePath = init.filePath;
  }
}
