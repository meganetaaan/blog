import Head from "next/head";
import { useContext } from "react";
import { Article, Global, Maybe, useGlobalQuery } from "../../src/generated/graphql";
import { getStrapiMedia } from "../../src/lib/util";

interface SeoProps {
  article: Article;
  globalData: Global;
}
const Seo = ({ article, globalData }: SeoProps) => {
  const siteName = globalData?.siteName
  const title = `${article?.title} | ${siteName}`

  return (
    <Head>
      {article?.title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {article?.description && (
        <>
          <meta name="description" content={article.description} />
          <meta property="og:description" content={article.description} />
          <meta name="twitter:description" content={article.description} />
        </>
      )}
      {article?.image && (
        <>
          <meta property="og:image" content={'https://meganetaaan.jp' + getStrapiMedia(article.image.url)} />
          <meta name="twitter:image" content={'https://meganetaaan.jp' + getStrapiMedia(article.image.url)} />
          <meta name="image" content={'https://meganetaaan.jp' + getStrapiMedia(article.image.url)} />
        </>
      )}
      {article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default Seo;
