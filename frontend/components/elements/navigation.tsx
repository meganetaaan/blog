import {
  Flex,
  Heading,
  Spacer,
  ButtonGroup,
  Button,
  forwardRef,
  BoxProps,
  useBreakpointValue,
  Box,
  Container,
  IconButton,
  Progress,
  Slide,
  ButtonProps
} from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import Link from "next/link"
import React, { Fragment, useState } from "react";
import { BiBeer } from "react-icons/bi";
import { FaGithubAlt } from "react-icons/fa";
import useRouterStatus from "../../src/lib/useRouterStatus";

const sponsorLinkProps: Partial<ButtonProps> & { href: string; target: string } = {
  as: "a",
  href: "https://github.com/sponsors/meganetaaan",
  target: "_blank"
};

const CircleButton = (<Button id="hoge" {...sponsorLinkProps} leftIcon={<BiBeer></BiBeer>} size="sm" colorScheme="teal">
  Be a Sponsor
</Button>)
const LabelButton = (
  <IconButton id="hoge"
    {...sponsorLinkProps}
    aria-label="be a sponsor"
    colorScheme="teal"
    isRound
    icon={<BiBeer />}
  ></IconButton>
)

const Navigation = forwardRef<BoxProps, "div">((props, ref) => {
  const { isLoading } = useRouterStatus();
  const [navigationShadow, setNavigationShadow] = useState<BoxProps["shadow"]>("base");
  const [scrolledY, setScrolledY] = useState(0);
  const [isNavigationShown, setNavigationShown] = useState(true);
  const BeerButton = useBreakpointValue({ base: LabelButton, sm: CircleButton });
  useScrollPosition(({ prevPos, currPos }) => {
    setNavigationShadow(currPos.y < -0 ? "md" : "sm")
    if (currPos.y > -90) {
      setNavigationShown(true)
    } else if (currPos.y < prevPos.y) {
      setScrolledY(0)
      setNavigationShown(false)
    } else {
      setScrolledY(scrolledY + (currPos.y - prevPos.y))
      if (scrolledY > 80) {
        setNavigationShown(true)
      }
    }
  });
  return (
    <Fragment>
      <Slide in={isNavigationShown} direction="top" style={{
        zIndex: 10,
        transform: "none",
        transitionProperty: "none"
      }} initial="enter">
        <Box
          shadow={navigationShadow}
          transitionProperty="box-shadow"
          transitionDuration="200ms"
          position="sticky"
          top="0"
          p={4}
          w="100%"
          h={20}
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
                  _hover={{
                    textDecoration: "underline"
                  }}
                >
                  ししかわ商店
                </Heading>
              </Link>
              <Spacer></Spacer>
                <ButtonGroup alignItems="center">
                  <IconButton
                    as="a"
                    display={BeerButton != null ? "inherit" : "hidden"}
                    href="https://github.com/meganetaaan"
                    target="_blank"
                    aria-label="github"
                    colorScheme="blackAlpha"
                    fontSize="lg"
                    isRound
                    icon={<FaGithubAlt />}
                  ></IconButton>
                  {BeerButton}
                </ButtonGroup>
            </Flex>
          </Container>
        </Box>
      </Slide>
      {isLoading && (
        <Progress
          zIndex="10"
          position="fixed"
          bg="transparent"
          colorScheme="whiteAlpha"
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
