import { style, keyframes } from "@vanilla-extract/css";

const pulse = keyframes({
  from: {
    backgroundPosition: "0% 0%",
  },
  to: {
    backgroundPosition: "-135% 0%",
  },
});

const backgroundColor = {
  backgroundPrimary: "#FFFFFF",
  backgroundOverlay: "rgba(41, 53, 95, 0.1)",
};

export const container = style({
  height: "100%",
  width: "100%",
  background: `linear-gradient(
    -90deg,
    ${backgroundColor.backgroundOverlay} 0%, 
    ${backgroundColor.backgroundPrimary} 50%, 
    ${backgroundColor.backgroundOverlay} 100%  
  )`,
  backgroundSize: "400% 400%",
  animation: `${pulse} 1.2s ease-in-out infinite`,
  borderRadius: "8px",
  opacity: "0.48",
});
