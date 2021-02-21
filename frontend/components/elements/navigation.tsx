import { ChatIcon, PhoneIcon } from "@chakra-ui/icons";
import { Flex, Heading, Spacer, ButtonGroup, Button, forwardRef, BoxProps } from "@chakra-ui/react";
import React, { FC } from "react";
import { BiBeer } from "react-icons/bi"

const Navigation = forwardRef<BoxProps, "div">((props, ref) => (
  <Flex zIndex="1" shadow="sm" position="sticky" top="0" p={4} w="100%" bg={'#ffffffdd'} sx={{
    backdropFilter: "blur(10px)"
  }} borderTopColor={"#008080"} borderTopWidth={4} ref={ref} {...props}>
    <Heading as="h1" fontSize="2xl">ししかわ商店</Heading>
    <Spacer></Spacer>
    <ButtonGroup spacing="2">
      <Button leftIcon={<BiBeer></BiBeer>} size="sm" colorScheme="teal">
        Buy me a Beer
    </Button>
    </ButtonGroup>
  </Flex>))

export default Navigation;
