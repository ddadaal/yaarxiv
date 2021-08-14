import { config } from "@/core/config";
import { entities } from "@/entities";

export default {
  entities,
  ...config.orm,
};
