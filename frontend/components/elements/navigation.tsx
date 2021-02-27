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
  IconButton,
  Progress,
} from "@chakra-ui/react"
import Link from "next/link"
import React, { FC, Fragment } from "react";
import { BiBeer } from "react-icons/bi";
import { FaGithubAlt, FaFacebook, FaTwitter } from "react-icons/fa";
import useRouterStatus from "../../src/lib/useRouterStatus";

const sponsorLinkProps: Partial<ButtonProps> = {
  as: "a",
  href: "https://github.com/sponsors/meganetaaan",
  target: "_blank"
}

const Navigation = forwardRef<BoxProps, "div">((props, ref) => {
  const { isLoading } = useRouterStatus();
  const bp = useBreakpointValue({ base: "base", sm: "sm" });
  return (
    <Fragment>
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
        <Container maxW="5xl" px={[0, null, 4]} boxSizing="border-box">
          <Flex align="center">
            <Link href="/">
              <Heading
                as="h1"
                fontSize="2xl"
                style={{
                  cursor: "pointer"
                }}
              >
                ししかわ商店
              </Heading>
            </Link>
            <Spacer></Spacer>
            <ButtonGroup alignItems="center">
              <IconButton
                as="a"
                href="https://github.com/meganetaaan"
                target="_blank"
                aria-label="github"
                colorScheme="blackAlpha"
                fontSize="lg"
                isRound
                icon={<FaGithubAlt />}
              ></IconButton>
              {bp !== "base" ? (
                <Button {...sponsorLinkProps} leftIcon={<BiBeer></BiBeer>} size="sm" colorScheme="teal">
                  Be a Sponsor
                </Button>
              ) : (
                <IconButton
                  {...sponsorLinkProps}
                  aria-label="be a sponsor"
                  colorScheme="teal"
                  isRound
                  icon={<BiBeer />}
                ></IconButton>
              )}
            </ButtonGroup>
          </Flex>
        </Container>
      </Box>
      {isLoading && (
        <Progress
          zIndex="10"
          position="fixed"
          bg="transparent"
          colorScheme="yellow"
          top="0"
          left="0"
          w="full"
          size="xs"
          isIndeterminate
        />
      )}
    </Fragment>
  );
});

export default Navigation;
