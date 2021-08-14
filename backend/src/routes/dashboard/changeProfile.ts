import * as api from "yaarxiv-api/api/dashboard/changeProfile";
import { route } from "@/core/route";

export const changeProfileRoute = route(
  api, "ChangeProfileSchema",
  async (req) => {
    const user = await req.dbUser();

    const { profileChange } = req.body;

    user.academicKeywords = profileChange.academicKeywords ?? user.academicKeywords;
    user.researchLabels = profileChange.researchLabels ?? user.researchLabels;
    user.jobTitle = profileChange.jobTitle ?? user.jobTitle;
    user.jobTitlePublic = profileChange.jobTitlePublic ?? user.jobTitlePublic;
    user.honor = profileChange.honor ?? user.honor;
    user.honorPublic = profileChange.honorPublic ?? user.honorPublic;
    user.institution = profileChange.institution ?? user.institution;
    user.institutionPublic = profileChange.institutionPublic ?? user.institutionPublic;

    await req.em.flush();

    return { 204: null };


  },
);
