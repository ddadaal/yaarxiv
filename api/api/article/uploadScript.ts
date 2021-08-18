import { UserRole } from "../auth/login";
import { ApiProps } from "../utils/apiProps";
import { ErrorResponse } from "../utils/error";
import { Endpoint } from "../utils/schema";
import { UploadedFileId } from "./models";

export const SCRIPT_SIZE_LIMIT_MB = 30;

export const ALLOWED_SCRIPT_FORMAT = ["txt", "pdf", "docx", "doc"];

/**
 * Upload a script into the platform.
 * Expect Content-Type to be multipart/form-data.
 * Only accepts txt, pdf, docx, doc
 */
export interface UploadScriptSchema {
  body: {
    /**
     * The file object.
     * 1 PDF per request.
     */
    file: File;
  },
  responses: {
    /** The upload is successful. */
    201: {
      /**
       * The token for the upload.
       * It is used to upload the following content of the article.
       */
      token: UploadedFileId;
    };

    400: ErrorResponse<"SCRIPT_FORMAT_ERROR">;
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
