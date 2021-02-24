import {
  Flex,
  Heading,
  Spacer,
  ButtonGroup,
  Button,
  forwardRef,
  BoxProps,
  useBreakpointValue,
  Circle,
  Box,
  Container,
  IconButton
} from "@chakra-ui/react";
import React, { FC } from "react";
import { BiBeer } from "react-icons/bi";
import { FaFacebook, FaTwitter } from "react-icons/fa";

const sponsorLinkProps: Partial<ButtonProps> = {
  as: "a",
  href: "https://github.com/sponsors/meganetaaan",
  target: "_blank"
}

const Navigation = forwardRef<BoxProps, "div">((props, ref) => {
  const bp = useBreakpointValue({ base: "base", sm: "sm" });
  return (
    <Box
      zIndex="1"
      shadow="sm"
      position="sticky"
      top="0"
      p={4}
      w="100%"
      bg={"#ffffffcc"}
      sx={{
        backdropFilter: "blur(4px)"
      }}
      borderTopColor={"#008080"}
      borderTopWidth={6}
      ref={ref}
      {...props}
    >
      <Container maxW="6xl" px={[0, null, 8]}>
        <Flex align="center">
          <Heading as="h1" fontSize="2xl">
            ししかわ商店
          </Heading>
          <Spacer></Spacer>
          <ButtonGroup alignItems="center">
            <IconButton as="a" href="https://www.facebook.com/meganetaaan" target="_blank" aria-label="facebook" colorScheme="facebook" isRound icon={<FaFacebook/>}></IconButton>
            <IconButton as="a" href="https://twitter.com/meganetaaan" target="_blank" aria-label="twitter" colorScheme="twitter" isRound icon={<FaTwitter/>}></IconButton>
            {bp !== "base" ? (
              <Button {...sponsorLinkProps} leftIcon={<BiBeer></BiBeer>} size="sm" colorScheme="teal">
                Be a Sponsor
              </Button>
            ) : (
              <IconButton {...sponsorLinkProps} aria-label="be a sponsor" colorScheme="teal" isRound icon={<BiBeer/>}></IconButton>
            )}
          </ButtonGroup>
        </Flex>
      </Container>
    </Box>
  );
});

export default Navigation;
