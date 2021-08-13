import { Article } from "@/entities/Article";
import { FastifyInstance } from "fastify";

export function getAllFilesOfArticle(article: Article) {

  const files =  article.revisions.getItems()
    .reduce((prev, curr) => {
      const path = curr.pdf.getEntity().filePath;
      prev.add(path);
      return prev;
    }, new Set<string>());

  return [...files];
}

/**
 * Precondition:
 * 1. the article.revisions.pdf is loaded
 * 2. the article has not been removed.
 *
 * Return a function that actually removes the file
 * Call the function **after** the article entity is removed
 * @param article article entity
 */
export function removeArticleFiles(article: Article) {

  const articleId = article.id;

  const files = getAllFilesOfArticle(article);

  return async (fastify: FastifyInstance) => {
    fastify.log.info(`Removing files of article ${articleId}: ${files.join(", ")}`);
    await Promise.all(files.map((x) => fastify.storage.removeFile(x)));
    fastify.log.info(`Files of article ${articleId} has been removed.`);

  };
}
