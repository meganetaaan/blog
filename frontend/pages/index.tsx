import { Box, Center, CircularProgress } from "@chakra-ui/react";
import React from "react";
import Articles from "../components/elements/articles";
import Seo from "../components/elements/seo";
import BasicLayout from "../components/layouts/basic-layout";
import { AllArticlesDocument, Article, Global, GlobalDocument, useAllArticlesQuery, useGlobalQuery } from "../src/generated/graphql";
import { addApolloState, initializeApollo } from "../src/lib/apolloClient";

export default function Home() {
  const { data, loading, error } = useAllArticlesQuery();
  const { data: globalData, loading: globalDataLoading } = useGlobalQuery();
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
      <Seo globalData={globalData?.global as Global} article={undefined}></Seo>
      <Box>
        {Content}
      </Box>
    </BasicLayout>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await Promise.all([
    apolloClient.query({
      query: AllArticlesDocument,
    }),
    apolloClient.query({
      query: GlobalDocument
    })
  ]);


  return addApolloState(apolloClient, {
    props: {},
    revalidate: 60 * 60
  });
}
