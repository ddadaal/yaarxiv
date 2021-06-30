import { Entity, Property, OneToMany,
  ManyToOne, PrimaryKey, Cascade, IdentifiedReference, Collection } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";
import urlJoin from "url-join";
import { config } from "@/utils/config";

@Entity()
export class PdfUpload {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => User)
  user: IdentifiedReference<User>;

  @Property()
  link: string;

  @OneToMany(() => ArticleRevision, (r) => r.pdf, { cascade: [Cascade.ALL]})
  articleRevisions = new Collection<ArticleRevision>(this);

  get pdfUrl(): string {
    return urlJoin(
      config.staticPrefix,
      config.upload.path,
      this.link,
    );
  }

}
