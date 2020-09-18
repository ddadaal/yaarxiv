import { Article } from "./Article";
import { PdfUpload } from "./PdfUpload";
import { encrypt, compare } from "@/utils/bcrypt";
import { Cascade, Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";

export type UserRole = "user" | "admin";

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

  @Enum({ items: ["user", "admin"]})
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
