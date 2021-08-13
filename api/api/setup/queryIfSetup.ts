import { ApiProps } from "../utils/apiProps";
import { Endpoint } from "../utils/schema";

export interface QueryIfSetupSchema {
  responses: {
    200: {
      /** Has the system been setup/ */
      setup: boolean;
    };
  }
}

export const props: ApiProps = {

};

export const endpoint = {
  method: "GET",
  url: "/setup",
} as Endpoint<QueryIfSetupSchema>;
