import { Box, Text, Center, HStack, Select, SimpleGrid, FormControl, FormLabel, Wrap } from "@chakra-ui/react";
import React, { ChangeEventHandler, EventHandler, useState } from "react";
import { Pictogram, PictogramProps } from "../../components/elements/pictogram";

const files = ["teacher.png", "holoscope.png", "jump.png", "tinker.png", "abduction.png", "yeah.png"].map(
  (f) => `/assets/images/${f}`
);

const styles: { [key: string]: Pick<PictogramProps, "bg" | "bgGradient"> } = {
  green: {
    bg: "green"
  },
  red: {
    bg: "red.500"
  },
  gradient: {
    bgGradient: "linear(primary.300, yellow.300)"
  }
};
export default function Home() {
  const [bg, setBg] = useState("green");
  const style = styles[bg];
  const handleColorChange = (event: any) => {
      setBg(event.currentTarget.value)
  }
  return (
    <Box w="full" h="full" px={2}>
      <HStack p={2}>
        <FormControl>
          <FormLabel>Color</FormLabel>
          <Select onChange={handleColorChange}>
            <option value="red">red</option>
            <option value="green">green</option>
            <option value="gradient">gradient</option>
          </Select>
        </FormControl>
      </HStack>

      <Wrap spacing={4}>
        {files.map((f) => (
          <Center key={f}>
            <Pictogram {...style} w="10rem" minH="10rem" file={f}></Pictogram>
          </Center>
        ))}
      </Wrap>
    </Box>
  );
}
