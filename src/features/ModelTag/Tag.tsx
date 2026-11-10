"use client";

import {
  type AriaAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  cloneElement,
  isValidElement,
  useState,
} from "react";

import {
  CLOSE_HOVER_COLOR,
  GAP,
  PRESET_COLORS,
  type PresetColor,
  type PresetStatusColor,
  STATUS_COLORS,
  closeStyle,
  disabledStyle,
  iconStyle,
  presetStyle,
  rootStyle,
  statusStyle,
  tint,
  variantStyle,
} from "./style";

type SemanticPart = "root" | "icon" | "content" | "close";
type Semantic<T> = Partial<Record<SemanticPart, T>>;
type SemanticOrFn<T> = Semantic<T> | ((info: { props: TagProps }) => Semantic<T>);

/**
 * The props antd 6's Tag accepted, which ModelTag passed straight through when it rendered one. They are declared here so that every prop a consumer could pass before still type-checks and still does what it did.
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** @deprecated Has no effect: the tag no longer uses antd's stylesheet, so there is no class prefix to change. */
  prefixCls?: string;
  className?: string;
  rootClassName?: string;
  color?: PresetColor | `${PresetColor}-inverse` | PresetStatusColor | (string & {});
  variant?: "filled" | "solid" | "outlined";
  closable?: boolean | ({ closeIcon?: ReactNode; disabled?: boolean } & AriaAttributes);
  closeIcon?: ReactNode;
  onClose?: (e: MouseEvent<HTMLElement>) => void;
  style?: CSSProperties;
  icon?: ReactNode;
  /** @deprecated Use `variant="filled"` instead. */
  bordered?: boolean;
  href?: string;
  target?: string;
  disabled?: boolean;
  classNames?: SemanticOrFn<string>;
  styles?: SemanticOrFn<CSSProperties>;
}

interface InternalTagProps extends TagProps {
  /** Whether `icon` renders a bare `<svg>`. antd's stylesheet aligned and spaced only those, so a glyph wrapped in a `<span>` sat on the baseline with no gap. */
  iconIsSvg?: boolean;
}

const isPreset = (color?: string): color is PresetColor => !!color && color in PRESET_COLORS;
const isStatus = (color?: string): color is PresetStatusColor =>
  color === "default" || (!!color && color in STATUS_COLORS);

const cx = (...names: (string | undefined | false)[]) =>
  names.filter(Boolean).join(" ") || undefined;

/** antd's CloseOutlined glyph from @ant-design/icons-svg (MIT), the default close icon of antd's Tag. */
const CloseOutlined = () => (
  <svg
    aria-hidden={"true"}
    data-icon={"close"}
    fill={"currentColor"}
    fillRule={"evenodd"}
    focusable={"false"}
    height={"1em"}
    style={{ display: "inline-block", lineHeight: 1 }}
    viewBox={"64 64 896 896"}
    width={"1em"}
  >
    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" />
  </svg>
);

/**
 * A stand-in for antd's Tag, which is what ModelTag rendered until antd stopped being a dependency. It keeps antd's markup (a `<span>`, or an `<a>` with `href`; the icon, then the text in its own `<span>`, then the close button), its props and what its default theme looks like, with every style inline so it needs no stylesheet and renders the same on the server.
 */
const Tag = (props: InternalTagProps) => {
  const {
    prefixCls: _prefixCls,
    className,
    rootClassName,
    style,
    children,
    icon,
    iconIsSvg,
    color,
    variant,
    closable,
    closeIcon,
    onClose,
    bordered: _bordered,
    href,
    target,
    disabled = false,
    classNames: classNamesProp,
    styles: stylesProp,
    onClick,
    ...rest
  } = props;
  const [visible, setVisible] = useState(true);
  const [closeHovered, setCloseHovered] = useState(false);

  const classNames =
    typeof classNamesProp === "function" ? classNamesProp({ props }) : classNamesProp;
  const styles = typeof stylesProp === "function" ? stylesProp({ props }) : stylesProp;

  // Variant and colour resolve the way antd's useColor does: `variant` wins, an `-inverse` colour means solid, and everything else is filled — `bordered` only ever chose filled, which is already the default.
  const inverse = color?.endsWith("-inverse");
  const mergedVariant = variant ?? (inverse ? "solid" : "filled");
  let mergedColor = inverse ? color?.replace("-inverse", "") : color;
  if (mergedColor === undefined && mergedVariant === "solid") mergedColor = "default";

  let colorStyle: CSSProperties = {};
  if (!disabled) {
    if (isPreset(mergedColor)) colorStyle = presetStyle(mergedColor, mergedVariant);
    else if (isStatus(mergedColor)) colorStyle = statusStyle(mergedColor, mergedVariant);
    else if (color) {
      colorStyle =
        mergedVariant === "solid"
          ? { backgroundColor: color }
          : {
              backgroundColor: tint(color),
              color,
              ...(mergedVariant === "outlined" && { borderColor: color }),
            };
    }
  }

  const iconNode =
    isValidElement<{ className?: string; style?: CSSProperties }>(icon) &&
    cloneElement(icon, {
      className: cx(icon.props.className, classNames?.icon),
      style: { ...(iconIsSvg && iconStyle), ...styles?.icon },
    });

  const triggerClose = (e: MouseEvent<HTMLElement>) => {
    if (disabled) return;
    e.stopPropagation();
    onClose?.(e);
    if (e.defaultPrevented) return;
    if (href) e.preventDefault();
    setVisible(false);
  };

  // antd's useClosable: `closable={false}`, or a falsy `closable` with `closeIcon` set to false or null, hides the button; so does leaving both unset. A `closable` object may carry its own icon and aria attributes.
  const showClose = !(
    (!closable && (closable === false || closeIcon === false || closeIcon === null)) ||
    (closable == null && closeIcon == null)
  );
  const {
    closeIcon: configIcon,
    disabled: _closeDisabled,
    ...closeAria
  } = typeof closable === "object" ? closable : {};
  const closeGlyph =
    configIcon ??
    (closeIcon != null && typeof closeIcon !== "boolean" ? closeIcon : <CloseOutlined />);

  const closeNode = showClose && (
    <span
      aria-disabled={disabled || undefined}
      aria-label={"Close"}
      className={cx(classNames?.close)}
      onClick={triggerClose}
      onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!e.repeat) e.currentTarget.click();
        }
      }}
      onMouseEnter={() => setCloseHovered(true)}
      onMouseLeave={() => setCloseHovered(false)}
      role={"button"}
      style={{
        ...closeStyle,
        marginInlineStart: iconNode ? GAP : 3,
        ...(closeHovered && !disabled && { color: CLOSE_HOVER_COLOR }),
        ...(disabled && { color: disabledStyle.color, cursor: "not-allowed" }),
        ...styles?.close,
      }}
      tabIndex={disabled ? -1 : 0}
      {...closeAria}
    >
      {closeGlyph}
    </span>
  );

  const hasContent =
    children !== undefined && children !== null && children !== false && children !== "";
  const content = iconNode ? (
    <>
      {iconNode}
      {hasContent && (
        <span
          className={classNames?.content}
          style={{ ...(iconIsSvg && { marginInlineStart: GAP }), ...styles?.content }}
        >
          {children}
        </span>
      )}
    </>
  ) : (
    children
  );

  const Root = href ? "a" : "span";
  return (
    <Root
      {...rest}
      aria-disabled={href && disabled ? true : rest["aria-disabled"]}
      className={cx(classNames?.root, className, rootClassName)}
      href={disabled ? undefined : href}
      onClick={disabled ? undefined : onClick}
      style={{
        ...rootStyle,
        ...variantStyle[mergedVariant],
        ...(disabled && disabledStyle),
        ...colorStyle,
        ...(!visible && { display: "none" }),
        ...styles?.root,
        ...style,
      }}
      target={target}
    >
      {content}
      {closeNode}
    </Root>
  );
};

export default Tag;
