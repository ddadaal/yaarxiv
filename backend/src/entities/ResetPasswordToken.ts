import { PrimaryKey, Property, Entity, OneToOne, IdentifiedReference } from "@mikro-orm/core";
import { config } from "@/utils/config";
import { User } from "./User";

@Entity()
export class ResetPasswordToken {
  @PrimaryKey()
  id: string;

  @OneToOne(() => User, (u) => u.resetPasswordToken, { owner: true, wrappedReference: true })
  user: IdentifiedReference<User>;

  @Property()
  time: Date;

  get isTimeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }
}
