import { Box, Flex, Spacer } from "@chakra-ui/react";
import React, { FC } from "react";
import Footer from "../elements/footer";
import Navigation from "../elements/navigation";

const BasicLayout: FC<unknown> = ({ children }) => (
  <Flex direction="column" w="full" h="full" minH="100vh" bg="gray.100">
    <Navigation w="full" />
    <Box mt={20} p={[0, null, 2]} pb={[0, 4]} flexGrow={1}>
      {children}
    </Box>
    <Footer ></Footer>
  </Flex>
)

export default BasicLayout;
