import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";
import Navigation from "../elements/navigation";

const BasicLayout: FC<unknown> = ({ children }) => (
  <Flex direction="column" w="full" >
    <Navigation w="full" h="20" />
    <Box flexGrow={1}>
      {children}
    </Box>
  </Flex>
)

export default BasicLayout;
