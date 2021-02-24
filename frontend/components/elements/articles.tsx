import { Box, Container, SimpleGrid, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Article } from "../../src/generated/graphql";
import ArticleCard from "./article-card";

interface Props {
  articles: Pick<Article, "id" | "slug" | "publishedAt" | "title" | "description" | "image" | "tags">[];
}
const ArticleList: FC<Props> = ({ articles }) => (
  <Container maxW="6xl">
    <SimpleGrid columns={[1, null, 3]} gridGap={4}>
      {articles.map((a) => (
        <Box key={a.id}>
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
    </SimpleGrid>
  </Container>
);

export default ArticleList;
