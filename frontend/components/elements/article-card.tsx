import { Box, BoxProps, Heading, HStack, Image, Stack, Tag, Text, useBreakpoint, useBreakpointValue, VStack } from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { Article } from "../../src/generated/graphql";
import { formatDate, getStrapiMedia } from "../../src/lib/util";

interface ArticleCardProps
  extends Pick<Article, "slug" | "publishedAt" | "title" | "description" | "tags">,
    Omit<BoxProps, "title"> {
  imageUrl?: string;
}
const ArticleCard: FC<ArticleCardProps> = ({
  slug,
  title,
  publishedAt,
  description,
  tags,
  imageUrl
}: ArticleCardProps) => {
  const src = getStrapiMedia(imageUrl) ?? "";

  const hoverStyle = useBreakpointValue({
    md: {
      transform: "scale(1.2)"
    }
  });
  return (
    <Link href={`/articles/${slug}`}>
      <Box
        as="article"
        shadow="sm"
        borderWidth="1px"
        borderColor="gray.100"
        overflow="hidden"
        rounded="md"
        role="group"
        bg="white"
        style={{
          cursor: "pointer"
        }}
      >
        <Stack direction={["row", null, "column"]}>
          <VStack flex="1" p={4} pb={[4, null, 0]} align="left">
            <Text color="gray.600" fontSize="sm" isTruncated noOfLines={3}>
              {formatDate(publishedAt)}
            </Text>
            <Heading color="gray.800" fontSize="xl" fontWeight="bold">
              {title}
            </Heading>
            {tags != null && tags.length > 0 && (
              <HStack w="full">
                {tags?.map((m) => (
                  <Tag key={m?.slug} as="a" href="#" size="sm">
                    {m?.name}
                  </Tag>
                ))}
              </HStack>
            )}
            <Text color="gray.600" fontSize="sm" isTruncated noOfLines={3}>
              {description}
            </Text>
          </VStack>
          <Box w={[3 / 10, null, "full"]} overflow="hidden">
            <Image
              w="full"
              h="full"
              maxH={300}
              transitionProperty="all"
              transition="ease-out"
              transitionDuration="800ms"
              _groupHover={hoverStyle}
              objectFit="cover"
              src={src}
            />
          </Box>
        </Stack>
      </Box>
    </Link>
  );
};
export default ArticleCard;
