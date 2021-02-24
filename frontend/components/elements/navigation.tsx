import { Flex, Heading, Spacer, ButtonGroup, Button, forwardRef, BoxProps, useBreakpointValue, Circle } from "@chakra-ui/react";
import React, { FC } from "react";
import { BiBeer } from "react-icons/bi"

const Navigation = forwardRef<BoxProps, "div">((props, ref) => {
  const bp = useBreakpointValue({ base: "base", sm: "sm" });
  return (
    <Flex zIndex="1" shadow="sm" position="sticky" top="0" p={4} w="100%" bg={'#ffffffdd'} sx={{
      backdropFilter: "blur(10px)"
    }} borderTopColor={"#008080"} borderTopWidth={6} ref={ref} {...props}>
      <Heading as="h1" fontSize="2xl">ししかわ商店</Heading>
      <Spacer></Spacer>
      {bp !== "base" ? <Button leftIcon={<BiBeer></BiBeer>} size="sm" colorScheme="teal">
        Be a Sponsor
    </Button> : <Circle size="40px" as="button" borderWidth={1} borderColor="gray.500" color="gray.500">
          <BiBeer></BiBeer>
        </Circle>}
    </Flex>)
})

export default Navigation;
