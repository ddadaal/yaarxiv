import { Article } from "./Article";
import { ArticleRevision } from "./ArticleRevision";
import { UploadedFile } from "./UploadedFile";
import { User } from "./User";
import { ResetPasswordToken } from "./ResetPasswordToken";
import { EmailValidationToken } from "@/entities/EmailValidationToken";

export const entities = [
  Article,
  ArticleRevision,
  UploadedFile,
  User,
  ResetPasswordToken,
  EmailValidationToken,
];
