import {
  Box,
  Center,
  CircularProgress,
  Container,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  SlideFade,
  Spacer,
  Tag,
  Text,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import { GetStaticPropsContext } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { GiShare } from "react-icons/gi";
import Markdown from "../../components/elements/markdown";
import ShareButtons from "../../components/elements/share-buttons";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllArticlesDocument,
  AllArticlesQuery,
  FindArticleBySlugDocument,
  GlobalDocument,
  useFindArticleBySlugQuery
} from "../../src/generated/graphql";
import { addApolloState, initializeApollo } from "../../src/lib/apolloClient";
import { getStrapiMedia } from "../../src/lib/media";

interface ArticlePageProperty {
  slug: string;
}
export default function ArticlePage({ slug }: ArticlePageProperty) {
  const [isSharePopupShown, setIsSharePopupShown] = useState(false);
  const { data, loading, error } = useFindArticleBySlugQuery({ variables: { slug } });
  const currentUrl = globalThis.window != null ? window?.location.href : ""
  const isLarge = useBreakpointValue({
    base: false,
    lg: true
  })
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
  return (
    <BasicLayout>
      <Container maxW="5xl" px={[0, null, 4]} py={0}>
        <HStack align="start" spacing={4}>
          {isLarge && !isSharePopupShown && (
            <VStack position="sticky" top="92px">
              <Icon as={GiShare} fontSize="lg" color="gray.400"></Icon>
              <ShareButtons url={currentUrl}></ShareButtons>
              <Spacer></Spacer>
            </VStack>
          )}

          <Box
            as="article"
            bg="white"
            flexGrow={1}
            rounded={[0, "md"]}
            shadow={[0, "base"]}
            borderWidth="1"
            borderColor="gray.100"
            overflow="hidden"
          >
            <VStack w="full">
              <VStack w="full" color="gray.800" spacing={2} align="left">
                <VStack align="left" px={[4, null, 6]} py={[2, null, 4]}>
                  <Text as="p" fontSize={["sm", null, "md"]} color="gray.600">
                    {new Date(Date.parse(article.publishedAt)).toDateString()}
                  </Text>
                  <Link href={`/articles/${slug}`}>
                    <Heading as="h1" fontSize={["3xl", null, "5xl"]} fontWeight="bold" cursor="pointer">
                      {article.title}
                    </Heading>
                  </Link>
                  <HStack>
                    {article.tags?.map((t) => (
                      <Tag key={t?.slug}>{t?.name}</Tag>
                    ))}
                  </HStack>
                </VStack>
                {coverUrl != null && (
                  <Box borderColor="gray.100" borderWidth={1}>
                    <Image w="full" maxH="50vh" objectFit="cover" src={coverUrl}></Image>
                  </Box>
                )}
                <Markdown px={[4, null, 6]} py={[2, null, 4]} content={article.content}></Markdown>
              </VStack>
            </VStack>
          </Box>
        </HStack>
        {!isLarge && (
          <VStack position="fixed" bottom={4} right={2}>
            <SlideFade in={isSharePopupShown}>
              <VStack>
                <ShareButtons url={currentUrl}></ShareButtons>
              </VStack>
            </SlideFade>
            <IconButton
              shadow="base"
              aria-label="share"
              isRound
              colorScheme="blackAlpha"
              onClick={() => {
                setIsSharePopupShown(!isSharePopupShown);
              }}
            >
              <Icon as={GiShare} fontSize="lg"></Icon>
            </IconButton>
          </VStack>
        )}
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
  return { paths, fallback: false };
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

  return addApolloState(apolloClient, {
    props: { slug }
  })
}
