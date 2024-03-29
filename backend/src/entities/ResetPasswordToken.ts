import { PrimaryKey, Property, Entity, OneToOne, IdentifiedReference } from "@mikro-orm/core";
import { config } from "@/core/config";
import { User } from "./User";
import { DATETIME_TYPE, EntityOrRef, toRef } from "@/utils/orm";

@Entity()
export class ResetPasswordToken {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  token: string;

  @OneToOne(() => User, (u) => u.resetPasswordToken, { owner: true, wrappedReference: true, onDelete: "CASCADE" })
  user: IdentifiedReference<User>;

  @Property({ columnType: DATETIME_TYPE })
  time: Date;

  get isTimeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }

  constructor(init: {
    token: string,
    user: EntityOrRef<User>,
    time: Date,
  }) {
    this.token = init.token;
    this.user = toRef(init.user);
    this.time = init.time;
  }
}
