import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { UploadedFileId } from "./models";

export const PDF_SIZE_LIMIT_MB = 30;

/**
 * Upload a script into the platform.
 * Expect Content-Type to be multipart/form-data.
 */
export interface UploadScriptSchema {
  body: {
    /**
     * The file object.
     * 1 PDF per request.
     */
    file: object;
  },
  responses: {
    /** The upload is successful. */
    201: {
      /**
       * The token for the upload.
       * It is used to upload the following content of the article.
       */
      token: UploadedFileId;
    }
  }
}

export const props: ApiProps = {
  requiredRoles: [UserRole.Admin, UserRole.User],
  consumes: ["multipart/form-data"],
};

export const endpoint = {
  url: "/articles/script",
  method: "POST",
} as Endpoint<UploadScriptSchema>;
