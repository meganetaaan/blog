import { gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import Articles from "../../components/elements/articles";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllArticlesDocument,
  AllArticlesQuery,
  Article,
  FindArticleBySlugDocument,
  useFindArticleBySlugQuery
} from "../../src/generated/graphql";
import { initializeApollo } from "../../src/lib/apolloClient";

interface ArticlePageProperty {
  slug: string;
}
export default function ArticlePage({ slug }: ArticlePageProperty) {
  const { data, loading, error } = useFindArticleBySlugQuery({ variables: { slug } });
  if (loading) {
    return <Box>Loading...</Box>;
  } else if (error) {
    return <Box>{error}</Box>;
  }
  return (
    <BasicLayout>
      <Box>
        {JSON.stringify(data)}
      </Box>
    </BasicLayout>
  );
}

export async function getStaticPaths() {
  // Get all pages from Strapi
  const apolloClient = initializeApollo();
  const res = await apolloClient.query<AllArticlesQuery>({
    query: AllArticlesDocument
  });
  const paths = res.data.articles?.map((article) => {
    const slug = article?.slug;
    // Decompose the slug that was saved in Strapi
    const slugArray = slug?.split("__");
    return {
      params: { slug: slugArray }
    };
  });
  return { paths, fallback: true };
}

const query = gql`
  query findArticleBySlug {
    articles(where: { slug: "the-internet-s-own-boy" }) {
      id
      title
      publishedAt
      content
      image {
        url
      }
      tags {
        name
        slug
      }
    }
  }
`;

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slugs = params?.slug;
  const slug = slugs != null && slugs.length > 0 ? slugs[0] : "";
  const apolloClient = initializeApollo();

  console.log(`requesting: ${slugs}`);
  await apolloClient.query({
    query: FindArticleBySlugDocument,
    variables: { slug }
  });

  // const cache = apolloClient.cache.extract();
  // console.log(cache)
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      slug
    }
  };
}
