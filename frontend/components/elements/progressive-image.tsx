import { BoxProps } from "@chakra-ui/layout"
import { Fade, Image as ChakraImage } from "@chakra-ui/react"
import React, { FC, Fragment, useEffect, useState } from "react"
import { Article } from "../../src/generated/graphql"
import { getStrapiMedia } from "../../src/lib/media"

interface ProgressiveImageProps extends BoxProps {
    image: Article["image"]
}
const ProgressiveImage: FC<ProgressiveImageProps> = ({ image, ...props }) => {
    const [isLoaded, setLoaded] = useState(false)
    const thumb = image?.formats?.thumbnail

    useEffect(() => {
        const img = new Image();
        img.src = getStrapiMedia(image?.url)
        img.onload = () => {
            setLoaded(true)
        }
    })

    return <Fragment>
        <ChakraImage alt={image?.alternativeText || ""} objectFit="cover" w="full" h="full" src={getStrapiMedia(thumb.url)} style={{ filter: "blur(4px)"}}></ChakraImage>
        <Fade in={isLoaded}>
            <ChakraImage alt={image?.alternativeText || ""} objectFit="cover" w="full" h="full" src={getStrapiMedia(image?.url)}></ChakraImage>
        </Fade>
    </Fragment>
}

export default ProgressiveImage