import { Article } from "./Article";
import { ArticleRevision } from "./ArticleRevision";
import { UploadedFile } from "./UploadedFile";
import { User } from "./User";
import { ResetPasswordToken } from "./ResetPasswordToken";
import { EmailValidationToken } from "@/entities/EmailValidationToken";
import { Metadata } from "@/entities/Metadata";

export const entities = [
  Article,
  ArticleRevision,
  UploadedFile,
  User,
  ResetPasswordToken,
  EmailValidationToken,
  Metadata,
];
