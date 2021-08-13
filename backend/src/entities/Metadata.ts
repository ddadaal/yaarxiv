import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/core";

export enum MetadataKey {
  Setup = "Setup"
}

@Entity()
export class Metadata {
  @PrimaryKey()
  key: MetadataKey;

  @Property({ nullable: true })
  value?: string;

  constructor(key: MetadataKey, value?: string) {
    this.key = key;
    this.value = value;
  }

  static async getMetadata(em: EntityManager, key: MetadataKey): Promise<Metadata | null> {
    return await em.findOne(Metadata, { key });
  }
}
