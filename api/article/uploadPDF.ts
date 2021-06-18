import { Endpoint } from "../utils/schema";

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
      token: string;
    }
  }
}

export const endpoint = {
  url: "/articles/pdf",
  method: "POST",
} as Endpoint<UploadPDFSchema>;
