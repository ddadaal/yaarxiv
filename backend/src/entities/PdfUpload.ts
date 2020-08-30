import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne } from "typeorm";
import { ArticleRevision } from "./ArticleRevision";
import { User } from "./User";

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

  @OneToOne(() => ArticleRevision, (r) => r.pdf, { nullable: true })
  articleRevision: ArticleRevision | undefined;

}
