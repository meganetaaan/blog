import Head from "next/head";
import { useContext } from "react";
import { Article, Global, Maybe, useGlobalQuery } from "../../src/generated/graphql";
import { getStrapiMedia } from "../../src/lib/util";

interface SeoProps {
  article?: Pick<Article, "title" | "description" | "image">;
  globalData: Global;
}
const Seo = ({ article, globalData }: SeoProps) => {
  const siteName = globalData?.siteName;
  const title = article == null ? siteName : `${article?.title} | ${siteName}`;
  const description = article?.description ?? globalData?.defaultSeo?.metaDescription;
  const defaultImage = `https://meganetaaan.jp/backend${globalData?.defaultSeo?.shareImage?.url}`;
  const imageUrl =
    article == null
      ? defaultImage
      : article.image?.formats?.large != null
      ? `https://meganetaaan.jp/backend${article.image.formats.large.url}`
      : `https://meganetaaan.jp/backend${article?.image?.url}`;

  return (
    <Head>
      {title && (
        <>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta name="twitter:title" content={title} />
        </>
      )}
      {description && (
        <>
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
          <meta name="twitter:description" content={description} />
        </>
      )}
      {imageUrl && (
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
