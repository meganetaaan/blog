import { Box, BoxProps, Heading, Text } from "@chakra-ui/react";
import ChakraUIRenderer, { defaults } from "chakra-ui-markdown-renderer";
import React from "react";
import ReactMarkdown from "react-markdown";

interface MarkdownProps extends BoxProps {
  content: string;
}

function getCoreProps(props) {
  return props["data-sourcepos"] ? { "data-sourcepos": props["data-sourcepos"] } : {};
}

const newTheme = {
  ...defaults,
  paragraph: (props: any) => {
    const { children } = props;
    return (
      <Text fontSize="lg" as="p">
        {children}
      </Text>
    );
  },
  text: (props: any) => {
    const { children } = props;
    return (
      <Text lineHeight={2} color="gray.800" as="span">
        {children}
      </Text>
    );
  },
  heading: (props: any) => {
    const { level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: any } = props;
    const sizes = ["xl", "lg", "lg", "md", "md", "md"];
    return (
      <Heading my={4} as={`h${level}` as "h1"} size={sizes[Number(`${level - 1}`)]} {...getCoreProps(props)}>
        {children}
      </Heading>
    );
  }
};
const Markdown = ({ content, ...props }: MarkdownProps) => (
  <Box {...props}>
    <ReactMarkdown renderers={ChakraUIRenderer(newTheme)} escapeHtml={false}>
      {content}
    </ReactMarkdown>
  </Box>
);

export default Markdown;
