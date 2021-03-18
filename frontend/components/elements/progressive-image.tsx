import { BoxProps } from "@chakra-ui/layout"
import { Fade, Image as ChakraImage } from "@chakra-ui/react"
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

    return <Fragment>
        <ChakraImage width={image?.width || undefined} height={image?.height || undefined} objectFit="cover" w="full" h="full" src={getStrapiMedia(thumb?.url, true)} style={{ filter: "blur(4px)" }}></ChakraImage>
        <Fade in={isLoaded}>
            <ChakraImage as="img" srcSet={srcSet} width={image?.width || undefined} height={image?.height || undefined} objectFit="cover" w="full" h="full" src={getStrapiMedia(large?.url)}></ChakraImage>
        </Fade>
    </Fragment>
}

export default ProgressiveImage
