import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PdfUpload {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  link: string;

}
