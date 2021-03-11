import { LinkIcon } from "@chakra-ui/icons";
import { Box, BoxProps, Heading, HStack, Image, Link, Text, useBreakpointValue } from "@chakra-ui/react";
import ChakraUIRenderer, { defaults } from "chakra-ui-markdown-renderer";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps extends BoxProps {
  content: string;
}

function getCoreProps(props: any) {
  return props["data-sourcepos"] ? { "data-sourcepos": props["data-sourcepos"] } : {};
}

const newTheme = {
  ...defaults,
  paragraph: (props: any) => {
    const fontSize = useBreakpointValue({
      base: "sm",
      lg: "lg"
    })
    const { children } = props;
    return (
      <Text fontSize={fontSize} as="p">
        {children}
      </Text>
    );
  },
  text: (props: any) => {
    const { children } = props;
    return (
      <Text lineHeight={2} as="span">
        {children}
      </Text>
    );
  },
  link: (props: any) => (
    <Link color="teal.500" target="_blank" {...props}></Link>
  ),
  img: (props: any) => (
    <Image py={4} {...props}></Image>
  ),
  heading: (props: any) => {
    const offset = useBreakpointValue({
      base: 0,
      lg: 1
    }) ?? 0;
    let firstChildText = ""
    let node = props.node
    while(node.children != null) {
      firstChildText = node.children[0].value
      node = node.children[0]
    }
    const { level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: any } = props;
    const lv = Math.max(0, level - offset)
    const sizes = ["2xl", "xl", "lg", "md", "base", "sm"];
    return (
      <HStack>
        <HStack role="group">
          <Link href={`#${firstChildText}`} w="auto">
            <Heading
              id={firstChildText}
              my={4}
              as={`h${level}` as "h1"}
              size={sizes[Number(`${lv}`)]}
              {...getCoreProps(props)}
            >
              {children}
            </Heading>
          </Link>
          <LinkIcon
            visibility="hidden"
            display="inline"
            _groupHover={{
              visibility: "visible"
            }}
          ></LinkIcon>
        </HStack>
      </HStack>
    );
  }
};

const theme = ChakraUIRenderer(newTheme)
theme.image = theme.img
const Markdown = ({ content, ...props }: MarkdownProps) => (
  <Box {...props} color="gray.800">
    <ReactMarkdown renderers={theme} escapeHtml={false}>
      {content}
    </ReactMarkdown>
  </Box>
);

export default Markdown;
