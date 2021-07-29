import * as api from "yaarxiv-api/api/dashboard/getProfile";
import { route } from "@/utils/route";

export const getProfileRoute = route(
  api, "GetProfileSchema",
  async (req) => {
    const user = await req.dbUser();

    return {
      200: {
        academicKeywords: user.academicKeywords,
        honor: user.honor,
        honorPublic: user.honorPublic,
        institution: user.institution,
        institutionPublic: user.institutionPublic,
        jobTitle: user.jobTitle,
        jobTitlePublic: user.jobTitlePublic,
        researchLabels: user.researchLabels,
      },
    };

  },
);
