import { Box, Container, SimpleGrid, useBreakpoint, useBreakpointValue, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Article } from "../../src/generated/graphql";
import ArticleCard from "./article-card";

interface Props {
  articles: Pick<Article, "id" | "slug" | "publishedAt" | "title" | "description" | "image" | "tags">[];
}
const ArticleList: FC<Props> = ({ articles }) => {
  const bp = useBreakpointValue({
    base: 1,
    md: 3
  });
  return (
  <Container maxW="5xl" px={[0, null, 2]}>
    <Box
      gridGap={0}
      style={{
        columnCount: bp,
      }}
    >
      {articles.map((a) => (
        <Box
          key={a.id}
          p={[1, null, 2]}
          style={{
            breakInside: "avoid-column"
          }}
        >
          <ArticleCard
            slug={a.slug}
            title={a.title}
            description={a.description}
            tags={a.tags}
            imageUrl={a.image?.url}
            publishedAt={a.publishedAt}
          />
        </Box>
      ))}
    </Box>
    {/* </SimpleGrid> */}
  </Container>
)};

export default ArticleList;
