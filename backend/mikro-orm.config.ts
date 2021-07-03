import { config } from "@/utils/config";
import { entities } from "@/entities";

export default {
  entities,
  ...config.orm,
};
