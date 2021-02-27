import { Box, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import Footer from "../elements/footer";
import Navigation from "../elements/navigation";

const BasicLayout: FC<unknown> = ({ children }) => (
  <Flex direction="column" w="full" h="full">
    <Navigation w="full" />
    <Box p={[0, null, 2]} pb={4} flexGrow={1} bg="gray.50">
      {children}
    </Box>
    <Footer ></Footer>
  </Flex>
)

export default BasicLayout;
