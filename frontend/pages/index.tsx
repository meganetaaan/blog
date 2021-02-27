import { Box, Center, CircularProgress, Fade } from "@chakra-ui/react";
import React from "react";
import Articles from "../components/elements/articles";
import BasicLayout from "../components/layouts/basic-layout";
import { AllArticlesDocument, Article, useAllArticlesQuery } from "../src/generated/graphql";
import { initializeApollo } from "../src/lib/apolloClient";

export default function Home() {
  const { data, loading, error } = useAllArticlesQuery();
  let Content;
  if (loading) {
    Content = <Center>
      <CircularProgress></CircularProgress>
    </Center>;
  } else if (error) {
    Content = <Box>{error}</Box>;
  } else {
    Content = <Articles articles={(data ? data.articles : []) as Article[]}></Articles>
  }
  return (
    <BasicLayout>
      <Box>
        {Content}
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
