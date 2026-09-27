"use client";

import { memo } from "react";

import IconAvatar, { type IconAvatarProps } from "@/features/IconAvatar";

import { AVATAR_BACKGROUND, AVATAR_COLOR, AVATAR_ICON_MULTIPLE, TITLE } from "../style";
import Color from "./Color";

export type AvatarProps = Omit<IconAvatarProps, "Icon">;

// The app icon is the colour mark on its lavender tile, so the avatar draws Color rather than Mono.
const Avatar = memo<AvatarProps>(({ ...rest }) => {
  return (
    <IconAvatar
      Icon={Color}
      aria-label={TITLE}
      background={AVATAR_BACKGROUND}
      color={AVATAR_COLOR}
      iconMultiple={AVATAR_ICON_MULTIPLE}
      {...rest}
    />
  );
});

export default Avatar;
