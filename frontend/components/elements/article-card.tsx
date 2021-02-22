import { BoxProps, Flex, Heading, Image, LinkBox, LinkOverlay, Text, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Article } from "../../src/generated/graphql";
import { getStrapiMedia } from "../../src/lib/media";

interface ArticleCardProps extends Pick<Article, 'slug' | 'publishedAt' | 'title' | 'description'>, Omit<BoxProps, 'title'> {
  imageUrl: string
}
const ArticleCard: FC<ArticleCardProps> = ({ slug, title, description, imageUrl }: ArticleCardProps) => {
  return <LinkBox as="article" transitionProperty="all" transition="ease-in" transitionDuration="100ms" shadow="sm" borderWidth="1px" overflow="hidden"
    rounded="md" _hover={{
    boxShadow: "base",
    transform: "translateY(-2px) scale(1.02)"
  }} >
    <Flex direction="column">
      <Image w="full" objectFit="cover" src={getStrapiMedia(imageUrl) ?? ""} />
      <VStack p={4}>
        <Heading color="gray.800" fontSize="xl" fontWeight="bold">
          <LinkOverlay href={slug}>{title}</LinkOverlay>
        </Heading>
        <Text color="gray.800">{description}</Text>
      </VStack>
    </Flex>
  </LinkBox>
}
export default ArticleCard;
