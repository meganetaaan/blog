import {
  Box,
  BoxProps,
  Flex,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Spacer,
  Tag,
  Text,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { FC } from "react";
import LazyLoad from "react-lazyload";
import { Article } from "../../src/generated/graphql";
import { formatDate, getStrapiMedia } from "../../src/lib/util";

interface ArticleCardProps
  extends Pick<Article, "slug" | "publishedAt" | "title" | "description" | "tags">,
    Omit<BoxProps, "title"> {
  imageUrl?: string;
  imageHeight: number | string;
  imageWidth: number | string;
}
const ArticleCard: FC<ArticleCardProps> = ({
  slug,
  title,
  publishedAt,
  description,
  tags,
  imageUrl,
  imageHeight = 500,
  imageWidth = 500
}: ArticleCardProps) => {
  const src = getStrapiMedia(imageUrl) ?? "";

  const hoverStyle = useBreakpointValue({
    md: {
      transform: "scale(1.2)"
    }
  });
  return (
    <LinkBox
      as="article"
      shadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      overflow="hidden"
      rounded="md"
      role="group"
      bg="white"
    >
      <Flex w="full" direction={["row", null, "column"]}>
        <VStack flexShrink={1} maxW={["66.666%", null, "full"]} p={4} pb={[4, null, 2]} align="left">
          <Text color="gray.600" fontSize="sm" whiteSpace="normal" noOfLines={3}>
            {formatDate(publishedAt)}
          </Text>
          <NextLink href={`/articles/${slug}`} passHref>
            <LinkOverlay zIndex={1}>
              <Heading color="gray.800" fontSize="xl" fontWeight="bold">
                {title}
              </Heading>
            </LinkOverlay>
          </NextLink>
          {tags != null && tags.length > 0 && (
            <HStack w="full">
              {tags?.map((t) => (
                <NextLink key={t?.slug} href={`/tags/${t?.slug}`} passHref>
                  <Tag as="a" size="sm" bg="tertiary.50">
                    {t?.name}
                  </Tag>
                </NextLink>
              ))}
            </HStack>
          )}
          <Text color="gray.600" fontSize="sm" whiteSpace="normal" noOfLines={3}>
            {description}
          </Text>
        </VStack>
        <Spacer></Spacer>
        <Box /* as="a" */ flexShrink={0} flexGrow={1} w={["33.333%", null, "full"]} overflow="hidden">
          <LazyLoad
            offset={150}
            style={{
              height: "100%",
              width: "auto",
              position: "relative"
            }}
          >
            <Image
              m="auto"
              alt={`cover image of ${title}`}
              w={imageWidth}
              h={imageHeight}
              bg="gray.200"
              maxH="300px"
              transitionProperty="all"
              transition="ease-out"
              transitionDuration="800ms"
              _groupHover={hoverStyle}
              objectPosition="center"
              objectFit="cover"
              src={src}
            />
          </LazyLoad>
        </Box>
      </Flex>
    </LinkBox>
  );
};
export default ArticleCard;
