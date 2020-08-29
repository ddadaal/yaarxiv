import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
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

}
