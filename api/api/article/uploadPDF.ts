import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";
import { UploadedFileId } from "./models";

/**
 * Upload a PDF into the platform.
 * Expect Content-Type to be multipart/form-data.
 */
export interface UploadPDFSchema {
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
  url: "/articles/pdf",
  method: "POST",
} as Endpoint<UploadPDFSchema>;
