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
    900: "#660008",
  }
}

const theme = extendTheme({ colors });
function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
