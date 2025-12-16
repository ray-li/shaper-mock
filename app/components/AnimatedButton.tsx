import { Button, SvgIcon } from "@mui/material";
import type { ButtonProps } from "@mui/material";

// ArrowForwardRounded icon as SVG (kept for reference, not used)
const ArrowForwardIcon = () => (
  <SvgIcon fontSize="small" viewBox="0 0 24 24">
    <path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6a.9959.9959 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1" />
  </SvgIcon>
);

type AnimatedButtonProps = {
  text?: string;
  href?: string;
  target?: string;
} & Omit<ButtonProps, "href" | "target">;

export default function AnimatedButton({
  text = "Start Designing",
  href,
  target = "_blank",
  ...buttonProps
}: AnimatedButtonProps) {
  const buttonSx = {
    borderRadius: "50px", // Pill shape
    ...buttonProps.sx,
  };

  const buttonPropsWithLink = href
    ? { href, target, ...buttonProps }
    : buttonProps;

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      disableElevation
      sx={buttonSx}
      {...buttonPropsWithLink}
    >
      {text}
    </Button>
  );
}