import { Entity, Column, PrimaryColumn } from "typeorm";

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
}
