import { Box } from "@chakra-ui/react";
import BasicLayout from "../components/layouts/basic-layout";
import Articles from "../components/elements/articles";
import { AllArticlesDocument, useAllArticlesQuery } from "../src/generated/graphql";
import { initializeApollo } from "../src/lib/apolloClient";

export default function Home() {
  const { data, loading, error } = useAllArticlesQuery();
  if (loading) {
    return <Box>Loading...</Box>
  } else if (error) {
    return <Box>{error}</Box>
  }
  console.log(data)
  return (
    <BasicLayout>
      <Box>
        <Articles articles={data?.articles}>
        </Articles>
      </Box>
    </BasicLayout>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: AllArticlesDocument,
  })

  return {
    props: {
      initialApolloState: apolloClient.cache.extract()
    }
  }
}
