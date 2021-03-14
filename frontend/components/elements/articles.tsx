import { Box, Container, useBreakpointValue } from "@chakra-ui/react";
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
  const thumbnailSize = useBreakpointValue({
    base: "thumbnail",
    md: "small"
  })
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
          if (thumbnailSize == null) {
            return
          }
          const url = thumbnailSize == null ? "" : formats[thumbnailSize]?.url || a.image?.url
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
                imageUrl={url}
                publishedAt={a.publishedAt}
              />
            </Box>
          )
        })}
      </Box>
      {/* </SimpleGrid> */}
    </Container>
  )
};

export default ArticleList;
