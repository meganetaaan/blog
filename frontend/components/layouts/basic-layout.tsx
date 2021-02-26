import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";
import Navigation from "../elements/navigation";

const BasicLayout: FC<unknown> = ({ children }) => (
  <Flex direction="column" w="full" h="full">
    <Navigation w="full" />
    <Box p={[0, null, 2]} flex={1} bg="gray.50">
      {children}
    </Box>
  </Flex>
)

export default BasicLayout;
