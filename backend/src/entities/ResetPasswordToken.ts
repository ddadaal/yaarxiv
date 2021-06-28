import { PrimaryKey, Property, Entity } from "@mikro-orm/core";
import { config } from "@/utils/config";

@Entity()
export class ResetPasswordToken {
  @PrimaryKey()
  id: string;

  @Property()
  userEmail: string;

  @Property("datetime")
  time: Date;

  get isTimeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }
}
