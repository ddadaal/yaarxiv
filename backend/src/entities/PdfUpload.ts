import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";
import urlJoin from "url-join";
import { config } from "@/utils/config";
import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { genId } from "@/utils/genId";

@Entity()
export class PdfUpload {
  @PrimaryKey()
  id: string = genId();

  @ManyToOne(() => User)
  user: User;

  @Property()
  link: string;

  @OneToMany(() => ArticleRevision, (r) => r.pdf)
  articleRevisions = new Collection<ArticleRevision>(this);

  get pdfUrl(): string {
    return urlJoin(
      config.staticPrefix,
      config.upload.path,
      this.link,
    );
  }

}
