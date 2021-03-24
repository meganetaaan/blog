import Head from "next/head";
import { useContext } from "react";
import { Article, Global, Maybe, useGlobalQuery } from "../../src/generated/graphql";
import { getStrapiMedia } from "../../src/lib/util";

interface SeoProps {
  article: Article;
  globalData: Global;
}
const Seo = ({ article, globalData }: SeoProps) => {
  const siteName = globalData?.siteName;
  const title = `${article?.title} | ${siteName}`;
  const imageUrl =
    article.image?.formats?.large != null
      ? `https://meganetaaan.jp/backend${article.image.formats.large.url}`
      : `https://meganetaaan.jp/backend${article?.image?.url}`;

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
          <meta property="og:image" content={imageUrl} />
          <meta name="twitter:image:src" content={imageUrl} />
          <meta name="image" content={imageUrl} />
        </>
      )}
      {article && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />
      {/* TODO */}
      <meta name="twitter:site" content="@meganetaaan" />
    </Head>
  );
};

export default Seo;
