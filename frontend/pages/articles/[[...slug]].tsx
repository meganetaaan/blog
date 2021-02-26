import {
  Box,
  Text,
  ButtonGroup,
  Container,
  HStack,
  IconButton,
  Image,
  VStack,
  Divider,
  Spacer,
  Icon,
} from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import React from "react";
import { GiShare } from "react-icons/gi";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import ReactMarkdown from "react-markdown/with-html";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllArticlesDocument,
  AllArticlesQuery,
  Article,
  FindArticleBySlugDocument,
  GlobalDocument,
  useFindArticleBySlugQuery
} from "../../src/generated/graphql";
import { initializeApollo } from "../../src/lib/apolloClient";
import { getStrapiMedia } from "../../src/lib/media";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";

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
  const article = data?.articles != null ? data.articles[0] : null;
  if (article == null) {
    return <Box>Not found</Box>;
  }
  const coverUrl = getStrapiMedia(article.image != null ? article.image.url : "/not-found");
  return (
    <BasicLayout>
      <Container maxW="5xl">
        <HStack align="start" spacing={4}>
          <VStack position="sticky" top="90px">
            <Icon as={GiShare} fontSize="lg" color="gray.400"></Icon>
            <IconButton
              as="a"
              href="https://www.facebook.com/meganetaaan"
              target="_blank"
              aria-label="facebook"
              colorScheme="facebook"
              isRound
              icon={<FaFacebook />}
            ></IconButton>
            <IconButton
              as="a"
              href="https://twitter.com/meganetaaan"
              target="_blank"
              aria-label="twitter"
              colorScheme="twitter"
              isRound
              icon={<FaTwitter />}
            ></IconButton>
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
              {coverUrl != null && (
                <Image w="full" maxH="50vh" objectFit="cover" src={coverUrl}></Image>
              )}
              <VStack w="full" color="gray.800" px={4} spacing={2} align="left">
                <Text px={4} as="h1" fontSize="4xl" fontWeight="bold">
                  {article.title}
                </Text>
                <Divider></Divider>
                <Box p={4} mb={4}>
                  <ReactMarkdown renderers={ChakraUIRenderer()} escapeHtml={false}>
                    {article.content}
                  </ReactMarkdown>
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
