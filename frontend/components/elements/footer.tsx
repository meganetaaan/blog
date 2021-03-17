import { Box, Text, BoxProps, Container, forwardRef, HStack } from "@chakra-ui/react";
import React from "react";
import { useGlobalQuery } from "../../src/generated/graphql";
import Markdown from "./markdown";

const Footer = forwardRef<BoxProps, "div">((props, ref) => {
  const { data, error, loading } = useGlobalQuery();
  return (
    <Box bg="gray.200" {...props} p={4}>
      <Container maxW="5xl" px={[0, null, 4]} pt={2}>
        <HStack>
          <Text>{data?.global?.copyrightNotice}</Text>
        </HStack>
      </Container>
    </Box>
  );
});

export default Footer;
