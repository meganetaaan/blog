import { Box, Fade } from "@chakra-ui/react";
import React from "react";
import Articles from "../components/elements/articles";
import BasicLayout from "../components/layouts/basic-layout";
import { AllArticlesDocument, Article, useAllArticlesQuery } from "../src/generated/graphql";
import { initializeApollo } from "../src/lib/apolloClient";

export default function Home() {
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

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: AllArticlesDocument
  });
  // await apolloClient.query({
  //   query: GlobalDocument,
  // })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  };
}
