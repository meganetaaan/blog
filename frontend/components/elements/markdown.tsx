import { LinkIcon } from "@chakra-ui/icons";
import {
  Box,
  BoxProps,
  Center,
  Divider,
  Heading,
  HStack,
  Image,
  Link,
  OrderedList,
  Spinner,
  Text,
  UnorderedList,
  useBreakpointValue
} from "@chakra-ui/react";
import ChakraUIRenderer, { defaults } from "chakra-ui-markdown-renderer";
import React, { Fragment, useRef, useState } from "react";
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

interface EmbeddedIframeProps extends BoxProps {
  url: string;
}

const EmbeddedIframe = ({ url, ...props }: EmbeddedIframeProps) => {
  const [isLoading, setLoading] = useState(true);
  const [h, setH] = useState(200);
  const ref = useRef(null);
  const handleIframeLoad = () => {
    if (ref == null || ref.current == null) {
      return;
    }
    const iframeElement = ref?.current as any;
    setH(iframeElement.contentWindow?.document?.body?.scrollHeight ?? 200);
    setLoading(false);
  };
  return (
    <Box mb={2} borderWidth={1} {...props} position="relative">
      <iframe
        style={{
          width: "100%",
          height: `${h}px`
        }}
        ref={ref}
        onLoad={handleIframeLoad}
        title="pictogram"
        src={url}
        allowFullScreen={false}
      ></iframe>
      {isLoading && (
        <Center position="absolute" bg="blackAlpha.200" top={0} left={0} w="full" h="full">
          <Spinner color="primary"></Spinner>
        </Center>
      )}
    </Box>
  );
};

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
      <Element
        fontSize={["sm", null, "md"]}
        spacing={0}
        as={ordered ? "ol" : "ul"}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
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
  link: (props: any) => {
    const href = props.href;
    if (href != null && !href.includes("http") && href.includes("#embed")) {
      return <EmbeddedIframe url={href} w="full"></EmbeddedIframe>;
    }
    return <Link color="primary.500" target="_blank" rel="noopener noreferrer" {...props}></Link>;
  },
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
        {level === 2 && <Divider borderColor="primary.500" mt={[-4, null, -5]} mb={4}></Divider>}
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
