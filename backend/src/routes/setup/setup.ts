import { Metadata, MetadataKey } from "@/entities/Metadata";
import { User, UserRole } from "@/entities/User";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/setup/setup";
import createError from "fastify-error";

const AlreadySetupError = createError("SYSTEM_ALREADY_SETUP", "The system has already setup.", 409);

export const setupRoute = route(
  api, "SetupSchema",
  async (req) => {
    const { admin } = req.body;

    const metadata = await Metadata.getMetadata(req.em, MetadataKey.Setup);

    if (metadata) {
      throw new AlreadySetupError();
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
