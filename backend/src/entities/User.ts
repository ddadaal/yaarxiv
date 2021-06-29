import { Entity, Property, OneToMany, PrimaryKey, Enum, Cascade, Collection } from "@mikro-orm/core";
import { Article } from "./Article";
import { PdfUpload } from "./PdfUpload";
import { encrypt, compare } from "@/utils/bcrypt";
import { UserRole } from "yaarxiv-api/auth/login";

export { UserRole };

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  password: string;

  @Property({ unique: true })
  email: string;

  @Enum(() => UserRole)
  role: UserRole;

  @OneToMany(() => PdfUpload, (p) => p.user, { cascade: [Cascade.ALL]})
  uploads = new Collection<PdfUpload>(this);

  @OneToMany(() => Article, (a) => a.owner, { cascade: [Cascade.ALL]})
  articles = new Collection<Article>(this);

  async setPassword(newPassword: string) {
    this.password = await encrypt(newPassword);
  }

  async passwordMatch(password: string) {
    return await compare(password, this.password);
  }
}
