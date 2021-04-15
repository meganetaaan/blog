import { ChatIcon, PhoneIcon, StarIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  chakra,
  Checkbox,
  Circle,
  Container,
  Flex,
  forwardRef,
  Heading,
  HTMLChakraProps,
  Image,
  LinkBox,
  SimpleGrid,
  Spacer,
  Tag,
  Text,
  useToast,
  Wrap,
  WrapItem
} from "@chakra-ui/react";
import { cx } from "@chakra-ui/utils";
import { NextPage } from "next";
import NextLink from "next/link";
import React, { FC } from "react";

export interface LinkOverlayProps extends HTMLChakraProps<"a"> {
  /**
   *  If `true`, the link will open in new tab
   */
  isExternal?: boolean;
}
export const LinkOverlay = forwardRef<LinkOverlayProps, "a">((props, ref) => {
  const { isExternal, target, rel, className, ...rest } = props;
  return (
    <chakra.a
      {...rest}
      href="#"
      ref={ref}
      className={cx("chakra-linkbox__overlay", className)}
      rel={isExternal ? "noopener noreferrer" : rel}
      target={isExternal ? "_blank" : target}
      __css={{
        position: "static",
        "&::before": {
          content: "''",
          cursor: "inherit",
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: "#00000088",
          width: "100%",
          height: "100%"
        }
      }}
    />
  );
});

type ChakraPageProps = {};

interface Link {
  url: string;
  text: string;
}
interface HeaderProps {
  title?: string;
  links?: Link[];
}

interface AirbnbCardProps {
  imageUrl: string;
  imageAlt: string;
  beds: number;
  baths: number;
  title: string;
  formattedPrice: string;
  reviewCount: number;
  rating: number;
}

const prop: AirbnbCardProps = {
  imageUrl: "https://bit.ly/2Z4KKcF",
  imageAlt: "Rear view of modern home with pool",
  beds: 3,
  baths: 2,
  title: "Modern home in city center in the heart of historic Los Angeles",
  formattedPrice: "$1,900.00",
  reviewCount: 34,
  rating: 4
};

const AirbnbCard: FC<AirbnbCardProps> = (property) => {
  const toast = useToast();
  return (
    <Box
      as="button"
      transitionProperty="all"
      transition="ease-in"
      transitionDuration="100ms"
      _hover={{
        boxShadow: "base",
        transform: "translateY(-2px)"
      }}
      boxShadow="sm"
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      onClick={() => {
        toast({
          title: "selected.",
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }}
    >
      <Image src={property.imageUrl} alt={property.imageAlt}></Image>
      <Box p="6">
        <Flex align="baseline">
          <Badge borderRadius="full" px="2" colorScheme="primary">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {property.beds} beds &bull; {property.baths} baths
          </Box>
        </Flex>
        <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {property.title}
        </Box>
        <Box>
          {property.formattedPrice}
          <Box as="span" color="gray.500" fontSize="sm">
            / wk
          </Box>
        </Box>
        <Flex align="center">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <StarIcon key={i} color={i < property.rating ? "primary.500" : "gray.300"} />
            ))}
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {property.reviewCount} reviews
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

const Header: FC<HeaderProps> = ({ title }) => (
  <Flex
    zIndex="1"
    shadow="md"
    position="sticky"
    top="0"
    p={4}
    w="100%"
    bg={"#ffffffdd"}
    sx={{
      backdropFilter: "blur(10px)"
    }}
    borderTopColor={"#008080"}
    borderTopWidth={4}
  >
    <Heading as="h1" fontSize="2xl">
      {title}
    </Heading>
    <Spacer></Spacer>
    <ButtonGroup spacing="2">
      <Button leftIcon={<ChatIcon></ChatIcon>} size="sm" colorScheme="primary">
        Sign In
      </Button>
      <Button rightIcon={<PhoneIcon></PhoneIcon>} size="sm" variant="outline" colorScheme="primary">
        Call Demo
      </Button>
    </ButtonGroup>
  </Flex>
);

const ChakraPage: NextPage<ChakraPageProps> = ({}) => (
  <Box>
    <Header title="Chakra UI test"></Header>
    <Container colorScheme="whiteAlpha" maxW="5xl">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae nemo repellat quibusdam nulla accusamus ad?
      Assumenda temporibus ut, at a culpa, reprehenderit deserunt blanditiis vel repellat ipsam sit, facere et!
      <Center>
        <Text
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          fontSize="6xl"
          fontWeight="extrabold"
          casing="uppercase"
        >
          Be Bold
        </Text>
      </Center>
      <AspectRatio maxW="600px" ratio={16 / 9} shadow="inner">
        <iframe style={{ zIndex: -1 }} title="pictogram" src="/sandboxes/pictogram" allowFullScreen></iframe>
      </AspectRatio>
      <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" bg="yellow.200" rounded="md">
        <Box as="time" dateTime="2021-01-15 15:30:00 +0000 UTC">
          13 days ago
        </Box>
        <Heading size="md" my="2">
          <NextLink href="#" passHref>
            <LinkOverlay>New Year, New Beginnings: Smashing Workshops & Audits</LinkOverlay>
          </NextLink>
        </Heading>
        <NextLink href="#typescript" passHref>
          <Tag as="a">TypeScript</Tag>
        </NextLink>
        <Text>
          Catch up on what’s been cookin’ at Smashing and explore some of the most popular community resources.
        </Text>
      </LinkBox>
      <SimpleGrid p={[2, 4]} columns={[1, 2, 3, 4]} spacing={[5, null, 10]}>
        {Array(5)
          .fill("")
          .map((_, i) => (
            <AirbnbCard key={i} {...prop}></AirbnbCard>
          ))}
      </SimpleGrid>
      <Checkbox bg="tomato" w="full" p="4" color="white" colorScheme="whiteAlpha" defaultIsChecked>
        This is the Checkbox
      </Checkbox>
      <Circle size="40px" bg="tomato" color="white">
        <PhoneIcon></PhoneIcon>
      </Circle>
      <Wrap py="2" spacing="2" align="center" maxW="lg">
        <WrapItem>
          <Tag as="button">OMG</Tag>
        </WrapItem>
        <WrapItem>
          <Tag as="button">These</Tag>
        </WrapItem>
        <WrapItem>
          <Tag as="button">Tags</Tag>
        </WrapItem>
        <WrapItem>
          <Tag as="button">Are</Tag>
        </WrapItem>
        <WrapItem>
          <Tag as="button">So</Tag>
        </WrapItem>
        <WrapItem>
          <Tag colorScheme="red" as="button">
            Useful
          </Tag>
        </WrapItem>
      </Wrap>
      <AspectRatio ratio={16 / 9}>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.952912260219!2d3.375295414770757!3d6.5276316452784755!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1567723392506!5m2!1sen!2sng" />
      </AspectRatio>
    </Container>
  </Box>
);

export default ChakraPage;
