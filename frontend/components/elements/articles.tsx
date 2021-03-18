import { Box, Container, Skeleton, useBreakpointValue } from "@chakra-ui/react";
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
  if (bp == null) {
    return <Box></Box>
  }
  return (
    <Container maxW="5xl" px={[0, null, 2]}>
      <Box
        gridGap={0}
        style={{
          columnCount: bp,
        }}
      >
        {articles.map((a) => {
          const formats = a.image != null ? a.image.formats : {}
          const thumbnail = formats?.small || a.image
          return (
            <Box
              key={a.slug}
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
                imageUrl={thumbnail?.url}
                publishedAt={a.publishedAt}
              />
            </Box>
          )
        })}
      </Box>
    </Container>
  )
};

export default ArticleList;
