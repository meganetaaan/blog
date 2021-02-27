import { Box, Center, CircularProgress, Container, Divider, HStack, Icon, IconButton, Image, Spacer, Tag, Text, VStack } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { GetStaticPropsContext } from "next";
import React from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { GiShare } from "react-icons/gi";
import ReactMarkdown from "react-markdown/with-html";
import { FacebookShareButton, HatenaIcon, HatenaShareButton, TwitterShareButton } from "react-share";
import Markdown from "../../components/elements/markdown";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllArticlesDocument,
  AllArticlesQuery,
  FindArticleBySlugDocument,
  GlobalDocument,
  useFindArticleBySlugQuery
} from "../../src/generated/graphql";
import { initializeApollo } from "../../src/lib/apolloClient";
import { getStrapiMedia } from "../../src/lib/media";

interface ArticlePageProperty {
  slug: string;
}
export default function ArticlePage({ slug }: ArticlePageProperty) {
  const { data, loading, error } = useFindArticleBySlugQuery({ variables: { slug } });
  const currentUrl = globalThis.window != null && window?.location.href
  if (loading) {
    return (
      <Center>
        <CircularProgress></CircularProgress>
      </Center>
    );
  } else if (error) {
    return <Box>{error}</Box>;
  }
  const article = data?.articles != null ? data.articles[0] : null;
  if (article == null) {
    return <Box>Not found</Box>;
  }
  const coverUrl = getStrapiMedia(article.image != null ? article.image.url : "/not-found");
  console.log(article.publishedAt)
  return (
    <BasicLayout>
      <Container maxW="5xl" p={[0, null, 4]}>
        <HStack align="start" spacing={4}>
          <VStack position="sticky" top="90px">
            <Icon as={GiShare} fontSize="lg" color="gray.400"></Icon>
            <TwitterShareButton url={currentUrl}>
              <IconButton aria-label="twitter" colorScheme="twitter" isRound icon={<FaTwitter />}></IconButton>
            </TwitterShareButton>
            <HatenaShareButton url={currentUrl}>
              <IconButton fontSize="sm" overflow="hidden" aria-label="hatena-bookmark" isRound icon={<HatenaIcon size={40} round={true}/>}></IconButton>
            </HatenaShareButton>
            <FacebookShareButton url={currentUrl}>
              <IconButton aria-label="facebook" colorScheme="facebook" isRound icon={<FaFacebook />}></IconButton>
            </FacebookShareButton>
            <Spacer></Spacer>
          </VStack>
          <Box
            as="article"
            rounded="md"
            bg="white"
            shadow="md"
            borderWidth="1"
            borderColor="gray.100"
            overflow="hidden"
          >
            <VStack w="full">
              {coverUrl != null && <Image w="full" maxH="50vh" objectFit="cover" src={coverUrl}></Image>}
              <VStack w="full" color="gray.800" px={4} spacing={2} align="left">
                <VStack align="left" px={4} mb={2}>
                  <Text as="p" fontSize="md" color="gray.600">
                    {new Date(Date.parse(article.publishedAt)).toDateString()}
                  </Text>
                  <Text as="h1" fontSize="4xl" fontWeight="bold">
                    {article.title}
                  </Text>
                  <HStack>
                    {article.tags?.map((t) => (
                      <Tag>{t?.name}</Tag>
                    ))}
                  </HStack>
                </VStack>
                <Divider></Divider>
                <Box p={4} mb={4}>
                  <Markdown content={article.content}></Markdown>
                </Box>
              </VStack>
            </VStack>
          </Box>
        </HStack>
      </Container>
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

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const slugs = params?.slug;
  const slug = slugs != null && slugs.length > 0 ? slugs[0] : "";
  const apolloClient = initializeApollo();

  await Promise.all([
    apolloClient.query({
      query: FindArticleBySlugDocument,
      variables: { slug }
    }),
    apolloClient.query({
      query: GlobalDocument
    })
  ]);

  // const cache = apolloClient.cache.extract();
  // console.log(cache)
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      slug
    }
  };
}
