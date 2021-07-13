import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "src/apis";
import { useHttpRequest } from "src/utils/useHttpErrorHandler";
import { ArticleId } from "yaarxiv-api/api/article/models";

interface Props {
  articleId: ArticleId;
  revision?: number;
  filename?: string;
  children: (onClick: () => void) => ReturnType<React.FC>;
}

const downloadMessage = (percent: string) => `正在下载文件……${percent}%`;

// require children to have only one child and accepts onClick
export const DownloadPdfLink: React.FC<Props> = ({
  articleId, revision,
  filename, children,
}) => {

  const [, setLoading] = useState(false);
  const call = useHttpRequest(setLoading);

  const toastId = useRef<React.ReactText | null>(null);

  const downloadFile = () => call(async () => {

    const update = (percent: number) => {

      if (toastId.current === null) {
        toastId.current = toast(
          downloadMessage((percent * 100).toFixed(1)),
          { progress: percent }
        );
      } else {
        toast.update(toastId.current, { progress: percent });
      }
    };

    update(0);

    await api.article.getArticleFile({ query: { revision }, path: { articleId } })
      .catch(async (e) => {
        if (e instanceof Response) {
          // download the file
          const reader = e.body!.getReader();

          // Step 2: get total length
          const contentLength = +e.headers.get("Content-Length")!;

          // Step 3: read the data
          let receivedLength = 0; // received that many bytes at the moment
          const chunks = new Uint8Array(contentLength);

          let error = false;

          while(true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            if (value) {
              chunks.set(value, receivedLength);
              receivedLength += value.length;
              update(receivedLength / contentLength);
            } else {
              error = true;
              break;
            }
          }

          if (toastId.current) {
            toast.done(toastId.current);
          }

          if (error) {
            toast.error("下载文件出现错误。请重试。");
          } else {
            const objectUrl = window.URL.createObjectURL(new Blob([chunks]));

            const anchor = document.createElement("a");
            document.body.appendChild(anchor);
            anchor.href = objectUrl;
            anchor.download = filename ?? "xx.pdf";
            anchor.click();
            window.URL.revokeObjectURL(objectUrl);
          }

        } else {
          throw e;
        }
      });
  });

  return children(downloadFile);

};
