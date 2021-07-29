import { Entity, Property, OneToMany, PrimaryKey, Enum, Collection,
  IdentifiedReference, OneToOne } from "@mikro-orm/core";
import { Article } from "./Article";
import { UploadedFile } from "./UploadedFile";
import { encrypt, compare } from "@/utils/bcrypt";
import { UserRole } from "yaarxiv-api/api/auth/login";
import { ResetPasswordToken } from "./ResetPasswordToken";
import { EmailValidationToken } from "@/entities/EmailValidationToken";

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

  @Property()
  validated: boolean = false;

  @OneToOne(() => EmailValidationToken, (e) => e.user, { wrappedReference: true })
  emailValidation?: IdentifiedReference<EmailValidationToken>;

  @Property({ default: "" })
  honor: string = "";

  @Property({ default: true })
  honorPublic: boolean = true;

  @Property({ default: "" })
  jobTitle: string = "";

  @Property({ default: true })
  jobTitlePublic: boolean = true;

  @Property({ default: "" })
  institution: string = "";

  @Property({ default: true })
  institutionPublic: boolean = true;

  @Property({ type: "json" })
  academicKeywords: string[] = [];

  @Property({ type: "json" })
  researchLabels: string[] = [];

  async setPassword(newPassword: string) {
    this.password = await encrypt(newPassword);
  }

  async passwordMatch(password: string) {
    return await compare(password, this.password);
  }

  constructor(init: {
    id?: number;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    validated?: boolean;
  }) {
    if (init.id) this.id = init.id;

    this.name = init.name;
    this.email = init.email;
    this.role = init.role;
    this.validated = init.validated ?? false;

    if (init.password) this.password = init.password;
  }

}
