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

const downloadMessage = (percent: number) => `正在下载文件……${(percent * 100).toFixed(1)}%`;

// require children to have only one child and accepts onClick
export const DownloadPdfLink: React.FC<Props> = ({
  articleId, revision,
  filename, children,
}) => {

  const [, setLoading] = useState(false);
  const call = useHttpRequest(setLoading);

  const toastId = useRef<React.ReactText | null>(null);

  const downloadFile = () => call(async () => {

    const abortController = new AbortController();

    function removeToast() {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }
    }

    function onClose() {
      removeToast();
      toast.info("下载已中断");
      abortController.abort();
    }

    const update = (percent: number) => {

      if (toastId.current === null) {
        toastId.current = toast.info(
          downloadMessage(percent),
          {
            progress: percent,
            onClick: onClose,
          },
        );
      } else if (percent === 1) {
        toast.done(toastId.current);
        removeToast();
        toast.success("下载成功");

      } else {
        toast.update(toastId.current, {
          render: downloadMessage(percent),
          hideProgressBar: false,
          progress: percent,
          onClick: onClose,
        });
      }
    };

    update(0);

    await api.article.getArticleFile(
      { query: { revision }, path: { articleId } },
      abortController.signal
    ).catch(async (e) => {
      if (e instanceof Response) {
        // download the file
        const reader = e.body!.getReader();

        // Step 2: get total length
        const contentLength = +e.headers.get("Content-Length")!;

        // Step 3: read the data
        let receivedLength = 0; // received that many bytes at the moment
        const chunks = new Uint8Array(contentLength);

        let error = false;

        while(!abortController.signal.aborted) {
          console.log(abortController.signal.aborted);
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

        if (error) {
          removeToast();
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
