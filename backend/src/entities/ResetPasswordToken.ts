import { PrimaryColumn, Column, Entity } from "typeorm";
import { config } from "@/utils/config";

@Entity()
export class ResetPasswordToken {
  @PrimaryColumn()
  id: string;

  @Column()
  userEmail: string;

  @Column("datetime")
  time: Date;

  get timeout() {
    return (new Date().getTime() - this.time.getTime()) > config.resetPassword.tokenValidTimeSeconds * 1000;
  }
}
