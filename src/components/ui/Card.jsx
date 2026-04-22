import React from "react";
import { colors, radius, shadow, spacing, transition } from "../../lib/tokens";

/**
 * Card — komponen atom dasar AgriSense.
 *
 * Props:
 *   variant  : 'default' | 'muted'
 *              default → putih + border tipis + shadow halus
 *              muted   → abu faint tanpa shadow (untuk background widget)
 *   padding  : override padding internal, default '1rem 1.25rem'
 *   onClick  : jika diisi, card jadi interaktif (hover + cursor pointer)
 *   style    : style tambahan dari luar
 *   children : konten bebas
 */
const Card = ({
  variant = "default",
  padding = `${spacing.lg} ${spacing.xl}`,
  onClick,
  style = {},
  children,
}) => {
  const isInteractive = typeof onClick === "function";

  const base = {
    borderRadius: radius.md,
    padding,
    transition: `box-shadow ${transition.normal}, transform ${transition.fast}`,
    boxSizing: "border-box",
  };

  const variantStyles = {
    default: {
      background: colors.bgCard,
      border: `0.5px solid ${colors.border}`,
      boxShadow: shadow.card,
    },
    muted: {
      background: colors.bgMuted,
      border: `0.5px solid ${colors.borderLight}`,
      boxShadow: "none",
    },
  };

  const interactiveStyles = isInteractive ? { cursor: "pointer" } : {};

  const [hovered, setHovered] = React.useState(false);

  const hoverStyles =
    isInteractive && hovered
      ? {
          boxShadow: `0 4px 16px rgba(45,106,79,0.12), 0 0 0 0.5px rgba(45,106,79,0.14)`,
          transform: "translateY(-1px)",
        }
      : {};

  return (
    <div
      style={{
        ...base,
        ...variantStyles[variant],
        ...interactiveStyles,
        ...hoverStyles,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => isInteractive && setHovered(true)}
      onMouseLeave={() => isInteractive && setHovered(false)}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={
        isInteractive ? (e) => e.key === "Enter" && onClick(e) : undefined
      }
    >
      {children}
    </div>
  );
};

export default Card;
