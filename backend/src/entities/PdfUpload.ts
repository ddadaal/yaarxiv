import { Entity, Property, OneToMany, ManyToOne, PrimaryKey, Cascade } from "@mikro-orm/core";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";
import urlJoin from "url-join";
import { config } from "@/utils/config";

@Entity()
export class PdfUpload {
  @PrimaryKey()
  id: string;

  @ManyToOne(() => User, (u) => u.uploads, { onDelete: "CASCADE" })
  user: User;

  @Property()
  userId: string;

  @Property()
  link: string;

  @OneToMany(() => ArticleRevision, (r) => r.pdf, { cascade: [Cascade.ALL]})
  articleRevisions: ArticleRevision[];

  get pdfUrl(): string {
    return urlJoin(
      config.staticPrefix,
      config.upload.path,
      this.link,
    );
  }

}
