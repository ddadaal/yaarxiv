import { Metadata, MetadataKey } from "@/entities/Metadata";
import { User, UserRole } from "@/entities/User";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/setup/setup";

export const setupRoute = route(
  api, "SetupSchema",
  async (req) => {
    const { admin } = req.body;

    const metadata = await Metadata.getMetadata(req.em, MetadataKey.Setup);

    if (metadata) {
      return { "409": { code: "SYSTEM_ALREADY_SETUP" } } as const;
    }

    const newMetadata = new Metadata(MetadataKey.Setup);

    const user = new User({
      name: "SystemAdmin",
      email: admin.email,
      role: UserRole.Admin,
      validated: true,
    });

    await user.setPassword(admin.password);

    await req.em.persistAndFlush([user, newMetadata]);

    return { 204: null };
  });
