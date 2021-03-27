import { BackgroundProps, Box, BoxProps, LayoutProps } from "@chakra-ui/react";
import React from "react";

export interface PictogramProps extends LayoutProps {
  file: string;
  bg?: BackgroundProps["bg"];
  bgGradient?: BackgroundProps["bgGradient"];
}

export const Pictogram = ({ file, bg = "green", bgGradient, ...props }: PictogramProps) => (
  <Box
    display="inline-block"
    bg={bg}
    bgGradient={bgGradient}
    sx={{
      maskImage: `url(${file})`,
      mask: "no-repeat center/100%",
      WebkitMask: "no-repeat center/100%",
      WebkitMaskImage: `url(${file})`
    }}
    {...props}
  ></Box>
);
