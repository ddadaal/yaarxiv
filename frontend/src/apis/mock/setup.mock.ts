import { realApi } from "../api";

export const setupApisMock: typeof realApi["setup"] = ({
  queryIfSetup: async () => {
    return { setup: true };
  },
  setup: async () => null,
});

