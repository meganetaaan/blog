import { BoxProps } from "@chakra-ui/layout"
import { Box, Fade, Image as ChakraImage } from "@chakra-ui/react"
import React, { FC, Fragment, useEffect, useState } from "react"
import { Article } from "../../src/generated/graphql"
import { getStrapiMedia } from "../../src/lib/util"

interface ProgressiveImageProps extends BoxProps {
    image: Article["image"]
}
const sizes = ["small", "medium", "large"];
const ProgressiveImage: FC<ProgressiveImageProps> = ({ image, ...props }) => {
    const [isLoaded, setLoaded] = useState(false)
    const thumb = image?.formats?.thumbnail
    const large = image?.formats?.large || image
    const formats = image?.formats
    let srcSet;
    if (formats != null) {
      srcSet = sizes
        .map((size) => {
          const img = formats[size] ?? image;
          return `${getStrapiMedia(img?.url, true)} ${img.width}w`;
        })
        .join(",");
    }

    useEffect(() => {
        const img = new Image();
        img.src = getStrapiMedia(large?.url)
        img.onload = () => {
            setLoaded(true)
        }
    }, [])

    return (
      <Box overflow="hidden" {...props}>
        <ChakraImage
          width={image?.width || undefined}
          height={image?.height || undefined}
          objectFit="cover"
          w="full"
          h="full"
          as="img"
          src={getStrapiMedia(thumb?.url, true)}
          style={{ filter: "blur(4px)" }}
        ></ChakraImage>
        <ChakraImage
          position="absolute"
          top={0}
          left={0}
          opacity={isLoaded ? 1 : 0}
          transition="opacity 300ms ease-out"
          width={image?.width || undefined}
          height={image?.height || undefined}
          objectFit="cover"
          as="img"
          w="full"
          h="full"
          srcSet={srcSet}
          src={getStrapiMedia(large?.url)}
        ></ChakraImage>
      </Box>
    );
}

export default ProgressiveImage
