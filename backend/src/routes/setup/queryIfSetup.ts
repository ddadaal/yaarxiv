import { Metadata, MetadataKey } from "@/entities/Metadata";
import { route } from "@/core/route";
import * as api from "yaarxiv-api/api/setup/queryIfSetup";

export const queryIfSetupRoute = route(
  api, "QueryIfSetupSchema",
  async (req) => {
    const metadata = await Metadata.getMetadata(req.em, MetadataKey.Setup);
    return {
      200: { setup: metadata !== null },
    };
  });
