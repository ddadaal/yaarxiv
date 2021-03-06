import { Entity, Property, OneToMany, PrimaryKey, Enum, Collection,
  IdentifiedReference, OneToOne } from "@mikro-orm/core";
import { Article } from "./Article";
import { UploadedFile } from "./UploadedFile";
import { encrypt, compare } from "@/utils/bcrypt";
import { UserRole } from "yaarxiv-api/api/auth/login";
import { ResetPasswordToken } from "./ResetPasswordToken";

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

  @OneToMany(() => UploadedFile, (p) => p.user)
  uploads = new Collection<UploadedFile>(this);

  @OneToMany(() => Article, (a) => a.owner)
  articles = new Collection<Article>(this);

  @OneToOne(() => ResetPasswordToken, (e) => e.user,
    { wrappedReference: true })
  resetPasswordToken?: IdentifiedReference<ResetPasswordToken>;

  async setPassword(newPassword: string) {
    this.password = await encrypt(newPassword);
  }

  async passwordMatch(password: string) {
    return await compare(password, this.password);
  }
}
