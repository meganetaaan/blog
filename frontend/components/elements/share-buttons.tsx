import { IconButton, IconButtonProps } from "@chakra-ui/react";
import React, { FC, Fragment } from "react";
import { FaTwitter, FaFacebook } from "react-icons/fa";
import { TwitterShareButton, HatenaShareButton, HatenaIcon, FacebookShareButton } from "react-share";

interface ShareButtonsProps {
  url: string;
  size?: IconButtonProps["size"]
  shadow?: IconButtonProps["shadow"];
}

const ShareButtons: FC<ShareButtonsProps> = ({ url, size = "lg", shadow = "base" }) => {
  return (
    <Fragment>
      <TwitterShareButton url={url}>
        <IconButton
          size={size}
          as="div"
          aria-label="twitter"
          colorScheme="twitter"
          shadow={shadow}
          isRound
          icon={<FaTwitter />}
        ></IconButton>
      </TwitterShareButton>
      <HatenaShareButton url={url}>
        <IconButton
          size={size}
          as="div"
          fontSize="sm"
          overflow="hidden"
          aria-label="hatena-bookmark"
          shadow={shadow}
          isRound
          icon={<HatenaIcon size={50} round={true} />}
        ></IconButton>
      </HatenaShareButton>
      <FacebookShareButton url={url}>
        <IconButton
          size={size}
          as="div"
          aria-label="facebook"
          colorScheme="facebook"
          shadow={shadow}
          isRound
          icon={<FaFacebook />}
        ></IconButton>
      </FacebookShareButton>
    </Fragment>
  );
};

export default ShareButtons
