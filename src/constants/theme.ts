import { Platform } from "react-native";

export const colors = {
  primary: "#39FF14",
  primaryPressed: "#2FE010",
  primaryDim: "rgba(57,255,20,0.12)",
  secondary: "#00C853",
  background: "#0B0F14",
  surface: "#1A1F2B",
  surfaceElevated: "#212736",
  border: "#2A3142",
  borderFocus: "#39FF14",
  text: "#E5E7EB",
  textMuted: "#9CA3AF",
  textInverse: "#0B0F14",
  danger: "#FF4D4D",
  success: "#00C853",
  overlay: "rgba(0,0,0,0.6)",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  display: 34,
  title: 26,
  heading: 20,
  body: 15,
  button: 16,
  caption: 12,
} as const;

export const lineHeight = {
  display: 40,
  title: 32,
  heading: 26,
  body: 22,
  button: 20,
  caption: 16,
} as const;

export const fontFamily = {
  regular: "Nunito_400Regular",
  semiBold: "Nunito_600SemiBold",
  bold: "Nunito_700Bold",
  extraBold: "Nunito_800ExtraBold",
} as const;

export const typography = {
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
  },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.title,
    lineHeight: lineHeight.title,
  },
  heading: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.heading,
    lineHeight: lineHeight.heading,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  bodyStrong: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.button,
    lineHeight: lineHeight.button,
  },
  caption: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
  },
} as const;

export const sizing = {
  ctaHeight: 52,
  inputHeight: 52,
  screenPaddingX: spacing.xl,
  maxContentWidth: 340,
  hitTarget: 44,
} as const;

export const glow = Platform.select({
  ios: {
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
  },
  default: { elevation: 0 },
}) as object;
