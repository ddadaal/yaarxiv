import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";
import urlJoin from "url-join";
import { getConfig } from "@/utils/config";

@Entity()
export class PdfUpload {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (u) => u.uploads, { onDelete: "CASCADE" })
  user: User;

  @Column()
  userId: string;

  @Column()
  link: string;

  @OneToMany(() => ArticleRevision, (r) => r.pdf, { onDelete: "CASCADE" })
  articleRevisions: ArticleRevision[];

  get pdfUrl(): string {
    return urlJoin(
      getConfig("staticPrefix"),
      getConfig("upload.path"),
      this.link,
    );
  }

}
