import { LinkIcon } from "@chakra-ui/icons";
import { Box, BoxProps, Divider, Heading, HStack, Image, Link, OrderedList, Text, UnorderedList, useBreakpointValue } from "@chakra-ui/react";
import ChakraUIRenderer, { defaults } from "chakra-ui-markdown-renderer";
import React, { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import defaultVscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";
import { getStrapiMedia } from "../../src/lib/util";

interface MarkdownProps extends BoxProps {
  content: string;
}

function getCoreProps(props: any): any {
  return props["data-sourcepos"] ? { "data-sourcepos": props["data-sourcepos"] } : {};
}

const newTheme = {
  ...defaults,
  paragraph: (props: any) => {
    const { children } = props;
    return (
      <Text fontSize={["sm", null, "md"]} as="p">
        {children}
      </Text>
    );
  },
  list: (props: any) => {
    const { start, ordered, children, depth } = props;
    const attrs = getCoreProps(props);
    if (start !== null && start !== 1 && start !== undefined) {
      attrs.start = start.toString();
    }
    let Element = UnorderedList;
    let styleType = "disc";
    if (ordered) {
      Element = OrderedList;
      styleType = "decimal";
    }
    if (depth === 1) styleType = "circle";
    return (
      <Element fontSize={["sm", null, "md"]} spacing={0} as={ordered ? "ol" : "ul"} styleType={styleType} pl={4} {...attrs}>
        {children}
      </Element>
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
  link: (props: any) => <Link color="teal.500" target="_blank" {...props}></Link>,
  img: ({ src, ...props }: any) => <Image py={4} src={getStrapiMedia(src)} {...props}></Image>,
  code: ({ language, value }: any) => (
    <SyntaxHighlighter
      style={defaultVscDarkPlus}
      showLineNumbers={true}
      language={language}
      children={value}
    ></SyntaxHighlighter>
  ),
  heading: (props: any) => {
    const offset =
      useBreakpointValue({
        base: 0,
        lg: 1
      }) ?? 0;
    let firstChildText = "";
    let node = props.node;
    while (node.children != null) {
      firstChildText = node.children[0].value;
      node = node.children[0];
    }
    const { level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: any } = props;
    const lv = Math.max(0, level - offset);
    const sizes = ["2xl", "xl", "lg", "md", "base", "sm", "sm"];
    return (
      <Fragment>
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
        {level === 2 && <Divider borderColor="teal.500" mt={[-4, null, -5]} mb={4}></Divider>}
      </Fragment>
    );
  }
};

const theme = ChakraUIRenderer(newTheme);
theme.image = theme.img;
const Markdown = ({ content, ...props }: MarkdownProps) => (
  <Box {...props} color="gray.800">
    <ReactMarkdown renderers={theme} escapeHtml={false}>
      {content}
    </ReactMarkdown>
  </Box>
);

export default Markdown;
