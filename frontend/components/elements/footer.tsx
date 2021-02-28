import { Box, BoxProps, Center, Container, forwardRef, HStack, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { useGlobalQuery } from "../../src/generated/graphql";
import Markdown from "./markdown";

const Footer = forwardRef<BoxProps, "div">((props, ref) => {
  const { data, error, loading } = useGlobalQuery();
  const bp = useBreakpointValue({ base: "base", sm: "sm" });
  return (
    <Box bg="gray.200" {...props} p={4}>
      <Container maxW="5xl" px={[0, null, 4]} pt={2}>
        <HStack>
          {!loading && (
              <Markdown content={data?.global?.copyrightNotice || ""}></Markdown>
          )}
        </HStack>
      </Container>
    </Box>
  );
});

export default Footer;
