import { Entity, Property, OneToMany,
  ManyToOne, PrimaryKey, Cascade, IdentifiedReference, Collection } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";
import urlJoin from "url-join";
import { config } from "@/utils/config";

@Entity()
export class UploadedFile {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User, { nullable: false, cascade: [Cascade.ALL], wrappedReference: true })
  user: IdentifiedReference<User>;

  @Property()
  filePath: string;

  @OneToMany(() => ArticleRevision, (r) => r.pdf, { cascade: [Cascade.ALL]})
  articleRevisions = new Collection<ArticleRevision>(this);

  getPdfUrl(): string {
    return urlJoin(
      config.staticPrefix,
      config.upload.path,
      this.filePath,
    );
  }

}