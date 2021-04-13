import { Text, Box, Center, CircularProgress, useBreakpointValue, VStack } from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import React, { useState } from "react";
import Articles from "../../components/elements/articles";
import Seo from "../../components/elements/seo";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllTagsDocument,
  AllTagsQuery,
  Article,
  FindArticleByTagDocument,
  Global,
  GlobalDocument,
  useFindArticleByTagQuery,
  useGlobalQuery
} from "../../src/generated/graphql";
import { addApolloState, initializeApollo } from "../../src/lib/apolloClient";

interface ArticlePageProperty {
  slug: string;
}
export default function ArticlePage({ slug }: ArticlePageProperty) {
  const { data, loading, error } = useFindArticleByTagQuery({ variables: { slug } });
  const { data: globalData, loading: globalDataLoading } = useGlobalQuery();
  const tag = data?.tags?.[0];
  let Content;
  if (loading) {
    Content = (
      <Center>
        <CircularProgress></CircularProgress>
      </Center>
    );
  } else if (error) {
    Content = <Box>{error}</Box>;
  } else {
    Content = (
      <VStack w="full">
        <Box w="full" maxW="5xl" px={[2, null, 5]} mt={2} align="left">
          {tag != null && (
            <Text fontSize={["md", null, "xl"]} color="gray.600" fontWeight={["normal", null, "semibold"]}>
              {tag.name}の記事…{data?.articles ? data.articles.length : 0}件
            </Text>
          )}
        </Box>
        <Box w="full">
          <Articles articles={(data ? data.articles : []) as Article[]}></Articles>
        </Box>
      </VStack>
    );
  }
  return (
    <BasicLayout>
      <Seo globalData={globalData?.global as Global} article={{
          title: `${tag?.name}の記事一覧`,
          description: ""
      }}></Seo>
      <Box>{Content}</Box>
    </BasicLayout>
  );
}

export async function getStaticPaths() {
  // Get all tags from Strapi
  const apolloClient = initializeApollo();
  const res = await apolloClient.query<AllTagsQuery>({
    query: AllTagsDocument
  });
  const paths = res.data.tags?.map((tag) => {
    const slug = tag?.slug;
    return {
      params: { slug }
    };
  });
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slug = params?.slug;
  const apolloClient = initializeApollo();

  await Promise.all([
    apolloClient.query({
      query: FindArticleByTagDocument,
      variables: { slug }
    }),
    apolloClient.query({
      query: GlobalDocument
    })
  ]);

  return addApolloState(apolloClient, {
    props: { slug }
  });
}
