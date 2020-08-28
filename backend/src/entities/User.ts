import { Cascade, Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "mikro-orm";
import { Article } from "./Article";

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

  @OneToMany(() => Article, (a) => a.owner, { cascade: [Cascade.ALL]})
  articles = new Collection<Article>(this);
}
