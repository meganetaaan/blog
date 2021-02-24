import { Box } from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import Articles from "../../components/elements/articles";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllArticlesDocument,
  AllArticlesQuery,
  Article,
  FindArticleBySlugDocument,
  useAllArticlesQuery
} from "../../src/generated/graphql";
import { initializeApollo } from "../../src/lib/apolloClient";

export default function ArticlePage() {
  const { data, loading, error } = useAllArticlesQuery();
  if (loading) {
    return <Box>Loading...</Box>;
  } else if (error) {
    return <Box>{error}</Box>;
  }
  return (
    <BasicLayout>
      <Box>
        <Articles articles={(data ? data.articles : []) as Article[]}></Articles>
      </Box>
    </BasicLayout>
  );
}

export async function getStaticPaths() {
  // Get all pages from Strapi
  const apolloClient = initializeApollo();
  const res = await apolloClient.query<AllArticlesQuery>({
    query: AllArticlesDocument
  })
  const paths = res.data.articles?.map((article) => {
    const slug = article?.slug
    // Decompose the slug that was saved in Strapi
    const slugArray = slug?.split('__');
    return {
      params: { slug: slugArray },
    };
  });
  return { paths, fallback: true };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = params?.slug as string;
  const apolloClient = initializeApollo();

  console.log(`requesting: ${slug}`)
  await apolloClient.query({
    query: FindArticleBySlugDocument,
    variables: {
      slug: slug
    }
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  };
}
