import { UserRole } from "../auth/login";


export interface ApiProps {
  summary?: string;
  requiredRoles?: UserRole[];
  management?: true;
  consumes?: string[];
}
