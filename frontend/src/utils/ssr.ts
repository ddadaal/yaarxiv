import { HttpError } from "src/apis/fetch";

export type SSRPageProps<TData> = TData | { error: HttpError };
