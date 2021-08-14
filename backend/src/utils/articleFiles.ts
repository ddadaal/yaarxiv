import { Article } from "@/entities/Article";

export const getArticleBasePath = (article: Article) => (
  `${article.owner.id}/${article.id}`
);

export const getPathForArticleFile = (article: Article, filename: string) => (
  `${getArticleBasePath(article)}/${filename}`
);

