import Document, { DocumentContext } from "next/document";
import { ServerStyleSheet } from "styled-components";
import { mediaStyles } from "src/styles/media";

export default class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}

            <style
              type="text/css"
              dangerouslySetInnerHTML={{ __html: mediaStyles }}
            />
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
