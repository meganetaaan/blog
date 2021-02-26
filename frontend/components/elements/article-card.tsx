import {
  AspectRatio,
  Box,
  BoxProps,
  Flex,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Spacer,
  Stack,
  Tag,
  Text,
  useBreakpoint,
  useBreakpointValue,
  VStack
} from "@chakra-ui/react";
import Link from "next/link";
import React, { FC } from "react";
import { Article } from "../../src/generated/graphql";
import { getStrapiMedia } from "../../src/lib/media";

interface ArticleCardProps
  extends Pick<Article, "slug" | "publishedAt" | "title" | "description" | "tags">,
    Omit<BoxProps, "title"> {
  imageUrl?: string;
}
const ArticleCard: FC<ArticleCardProps> = ({ slug, title, description, tags, imageUrl }: ArticleCardProps) => {
  const hoverStyle = useBreakpointValue({
    md: {
      boxShadow: "base",
      transform: "translateY(-2px) scale(1.02)"
    }
  });
  return (
    <Link href={`/articles/${slug}`}>
      <Box
        as="article"
        transitionProperty="all"
        transition="ease-in"
        transitionDuration="100ms"
        shadow="sm"
        borderWidth="1px"
        borderColor="gray.100"
        overflow="hidden"
        rounded="md"
        bg="white"
        style={{
          cursor: "pointer"
        }}
        _hover={hoverStyle}
      >
        <Stack direction={["row", null, "column"]}>
          <VStack flex="1" p={4} align="left">
            <Heading color="gray.800" fontSize="xl" fontWeight="bold">
              {title}
            </Heading>
            {tags != null && tags.length > 0 && (
              <HStack w="full">
                {tags?.map((m) => (
                  <Tag key={m?.id} as="a" href="#" size="sm">
                    {m?.name}
                  </Tag>
                ))}
              </HStack>
            )}
            <Text color="gray.800" isTruncated noOfLines={3}>
              {description}
            </Text>
          </VStack>
          <Box w={[3 / 10, null, "full"]}>
            <Image w="full" h="full" objectFit="cover" src={getStrapiMedia(imageUrl) ?? ""} />
          </Box>
        </Stack>
      </Box>
    </Link>
  );
};
export default ArticleCard;
