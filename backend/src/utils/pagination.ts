import { config } from "./config";


export const paginationProps = (page?: number) => ({
  offset: ((page ?? 1) - 1) * config.defaultPageSize,
  take: config.defaultPageSize,
});
