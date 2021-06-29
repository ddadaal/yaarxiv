import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { config } from "@/utils/config";

@Entity()
export class ResetPasswordToken {
  @PrimaryKey()
  id: number;

  @Property()
  userEmail: string;

  @Property()
  time: Date;

  get isTimeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }
}
