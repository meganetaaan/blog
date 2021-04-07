import {
  AspectRatio,
  Box,
  Center,
  CircularProgress,
  Container,
  Heading,
  HStack,
  Icon,
  IconButton,
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
import ProgressiveImage from "../../components/elements/progressive-image";
import Seo from "../../components/elements/seo";
import ShareButtons from "../../components/elements/share-buttons";
import BasicLayout from "../../components/layouts/basic-layout";
import {
  AllArticlesDocument,
  AllArticlesQuery,
  Article,
  FindArticleBySlugDocument,
  Global,
  GlobalDocument,
  useFindArticleBySlugQuery,
  useGlobalQuery
} from "../../src/generated/graphql";
import { addApolloState, initializeApollo } from "../../src/lib/apolloClient";
import { formatDate } from "../../src/lib/util";

interface ArticlePageProperty {
  slug: string;
}
export default function ArticlePage({ slug }: ArticlePageProperty) {
  const [isSharePopupShown, setIsSharePopupShown] = useState(false);
  const { data, loading, error } = useFindArticleBySlugQuery({ variables: { slug } });
  const { data: globalData, loading: globalDataLoading } = useGlobalQuery();
  const currentUrl = globalThis.window != null ? window?.location.href : ""
  const isLarge = useBreakpointValue({
    base: false,
    lg: true
  })
  if (loading || globalDataLoading) {
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
  return (
    <BasicLayout>
      <Seo globalData={globalData?.global as Global} article={article as Article}></Seo>
      <Container maxW="5xl" px={[0, null, 4]} py={0}>
        <HStack align="start" spacing={4}>
          {isLarge && (
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
                    {formatDate(article.publishedAt)}
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
                {article.image && (
                  <AspectRatio
                    maxH="60vh"
                    w="full"
                    ratio={(article.image?.width || 0) / (article.image?.height || 1)}
                    overflow="hidden"
                  >
                    <ProgressiveImage
                      w="full"
                      height="auto"
                      image={article.image as Article["image"]}
                    ></ProgressiveImage>
                  </AspectRatio>
                )}
                <Markdown px={[4, null, 6]} py={[2, null, 4]} content={article.content}></Markdown>
              </VStack>
            </VStack>
          </Box>
        </HStack>
        {!isLarge && (
          <VStack position="fixed" bottom={6} right={4}>
            <SlideFade in={isSharePopupShown} unmountOnExit={true}>
              <VStack>
                <ShareButtons size="lg" url={currentUrl}></ShareButtons>
              </VStack>
            </SlideFade>
            <IconButton
              size="lg"
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
