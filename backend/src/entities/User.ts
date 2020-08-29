import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Article } from "./Article";
import { PdfUpload } from "./PdfUpload";

export type UserRole = "user" | "admin";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: "simple-enum",
    enum: ["user", "admin"],
    default: "user",
  })
  role: UserRole;

  @OneToMany(() => PdfUpload, (p) => p.user, { cascade: true, onDelete: "CASCADE" })
  uploads: PdfUpload[];

  @OneToMany(() => Article, (a) => a.owner, { cascade: true, onDelete: "CASCADE" })
  articles: Article[];
}
