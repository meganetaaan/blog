import { Box, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Article } from "../../src/generated/graphql";

interface Props {
  articles: Pick<Article, 'id' | 'slug' | 'publishedAt' | 'title' | 'description'>[]
}
const ArticleList: FC<Props> = ({ articles }) => (
  <VStack>
    {articles.map(a => (
      <Box key={a.id}>
        {a.title}, {a.description}
      </Box>
    ))}
  </VStack>
)

export default ArticleList