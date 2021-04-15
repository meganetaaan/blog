import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import React from "react";
import { useApollo } from "../src/lib/apolloClient";
import "../styles/globals.css";

const colors = {
  brand: {
    600: "#E50012",
    700: "#CC0011",
    800: "#A6000E",
    900: "#660008"
  },
  primary: {
    50: "#e3f8f4",
    100: "#cbe2e0",
    200: "#b1cccb",
    300: "#93b6b5",
    400: "#77a1a0",
    500: "#5e8887", // !
    600: "#476a69",
    700: "#304c4c",
    800: "#182e2e",
    900: "#001212"
  },
  secondary: {
    50: "#e5f8f8",
    100: "#cce2e3",
    200: "#b0cdcf", // !
    300: "#92b9bb",
    400: "#74a4a7",
    500: "#5b8b8e",
    600: "#466d6f",
    700: "#304e4f",
    800: "#193031",
    900: "#001212"
  },
  tertiary: {
    50: "#e7f7f7",
    100: "#d1dede",
    200: "#b7c7c7", // !
    300: "#9db1b1",
    400: "#819999",
    500: "#688080",
    600: "#506464",
    700: "#384848",
    800: "#1f2c2c",
    900: "#001111"
  },
  accent: {
    50: "#feefef",
    100: "#dfd6d8",
    200: "#c3bcbe",
    300: "#aaa1a4",
    400: "#918789",
    500: "#776d70",
    600: "#5e5557", // !
    700: "#443d3e",
    800: "#2b2325",
    900: "#170808"
  }
};

const theme = extendTheme({ colors });
function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
