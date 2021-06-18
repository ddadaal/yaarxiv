import { Entity, Property, OneToMany, PrimaryKey, Enum, Cascade } from "@mikro-orm/core";
import { Article } from "./Article";
import { PdfUpload } from "./PdfUpload";
import { encrypt, compare } from "@/utils/bcrypt";
import { UserRole } from "yaarxiv-api/auth/login";

@Entity()
export class User {
  @PrimaryKey()
  id: string;

  @Property()
  name: string;

  @Property()
  password: string;

  @Property({ unique: true })
  email: string;

  @Enum(() => UserRole)
  role: UserRole;

  @OneToMany(() => PdfUpload, (p) => p.user, { cascade: [Cascade.ALL]})
  uploads: PdfUpload[];

  @OneToMany(() => Article, (a) => a.owner, { cascade: [Cascade.ALL]})
  articles: Article[];

  async setPassword(newPassword: string) {
    this.password = await encrypt(newPassword);
  }

  async passwordMatch(password: string) {
    return await compare(password, this.password);
  }
}
