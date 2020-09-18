import { config } from "@/utils/config";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class ResetPasswordToken {
  @PrimaryKey()
  id: string;

  @Property()
  userEmail: string;

  @Property()
  time: Date;

  get timeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }
}
