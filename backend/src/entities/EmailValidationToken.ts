import { config } from "@/core/config";
import { genToken } from "@/utils/genId";
import { DATETIME_TYPE, EntityOrRef, toRef } from "@/utils/orm";
import { Entity, IdentifiedReference, PrimaryKey, Property } from "@mikro-orm/core";
import { OneToOne } from "@mikro-orm/core/decorators";
import { User } from "./User";

@Entity()
export class EmailValidationToken {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  token: string;

  @Property({ columnType: DATETIME_TYPE })
  time: Date;

  @Property({ columnType: DATETIME_TYPE })
  lastSent: Date;

  @OneToOne(() => User, (u) => u.emailValidation, { owner: true, wrappedReference: true })
  user: IdentifiedReference<User>;

  constructor(user: EntityOrRef<User>, time?: Date, lastSend?: Date, token?: string) {
    this.user = toRef(user);
    this.time = time ?? new Date();
    this.token = token ?? genToken();
    this.lastSent = lastSend ?? this.time;
  }

  timeout(now: Date = new Date()) {
    return (now.getTime() - this.time.getTime()) > config.emailValidation.timeoutSeconds * 1000;
  }

  shouldResend(now: Date = new Date()) {
    return (now.getTime() - this.lastSent.getTime()) > config.emailValidation.sendIntervalSeconds * 1000;
  }
}
