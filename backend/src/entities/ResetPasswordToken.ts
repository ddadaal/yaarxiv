import { PrimaryKey, Property, Entity, OneToOne, IdentifiedReference } from "@mikro-orm/core";
import { config } from "@/utils/config";
import { User } from "./User";
import { EntityOrRef, toRef } from "@/utils/orm";

@Entity()
export class ResetPasswordToken {
  @PrimaryKey()
  id: string;

  @OneToOne(() => User, (u) => u.resetPasswordToken, { owner: true, wrappedReference: true, onDelete: "CASCADE" })
  user: IdentifiedReference<User>;

  @Property()
  time: Date;

  get isTimeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }

  constructor(init: {
    id: string,
    user: EntityOrRef<User>,
    time: Date,
  }) {
    this.id = init.id;
    this.user = toRef(init.user);
    this.time = init.time;
  }
}
