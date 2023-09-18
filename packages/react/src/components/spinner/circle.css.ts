import { keyframes, style, styleVariants } from "@vanilla-extract/css";

const animationDuration = "3s";

const expandFrom50To128 = keyframes({
  // delay for 10% of the total animation duration, here: 0.3s
  "0%, 10%": {
    transform: "scale(1)",
  },
  // animate for 20% of the total animation duration, here: 0.6s
  "30%": {
    transform: "scale(calc(88 / 50))",
  },
  // animate for 20% of the total animation duration, here: 0.6s
  // then pause for 30% of the total animation duration, here: 0.9s
  "50%, 80%": {
    transform: "scale(calc(128 / 50))",
  },
  // animate for 10% of the total animation duration, here: 0.3s
  // then pause for 10% of the total animation duration, here: 0.3s
  "90%, 100%": {
    transform: "scale(1)",
  },
});

const expandFrom50To88 = keyframes({
  // delay for 10% of the total animation duration, here: 0.3s
  "0%, 10%": {
    transform: "scale(1)",
  },
  // animate for 20% of the total animation duration, here: 0.6s
  // then pause for 50% of the total animation duration, here: 1.5s
  "30%, 80%": {
    transform: "scale(calc(88 / 50))",
  },
  // animate for 10% of the total animation duration, here: 0.3s
  // then pause for 10% of the total animation duration, here: 0.3s
  "90%, 100%": {
    transform: "scale(1)",
  },
});

const expandFrom50To53 = keyframes({
  // delay for 10% of the total animation duration, here: 0.3s
  "0%, 10%": {
    transform: "scale(1)",
  },
  // animate for 20% of the total animation duration, here: 0.6s
  // then pause for 50% of the total animation duration, here: 1.5s
  "30%, 80%": {
    transform: "scale(calc(53 / 50))",
  },
  // animate for 10% of the total animation duration, here: 0.3s
  // then pause for 10% of the total animation duration, here: 0.3s
  "90%, 100%": {
    transform: "scale(1)",
  },
});

const animationProps = `${animationDuration} cubic-bezier(0, 0, 0, 0.63) infinite`;

export const background = style({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "128px",
  height: "128px",
  margin: "16px auto 24px auto",
});

const outerCircle = style({
  position: "absolute",
  width: "50px",
  height: "50px",
  borderRadius: "100%",
  boxSizing: "border-box",
  opacity: 0.5,
  animation: `${expandFrom50To128} ${animationProps}`,
});
export const outerCircleVariants = styleVariants({
  blue: [
    outerCircle,
    {
      border: "1px solid rgba(42, 106, 255, 0.02)",
      background:
        "linear-gradient(311deg, rgba(42, 106, 255, 0.06) -7.54%, rgba(42, 106, 255, 0.00) 123.57%)",
    },
  ],
  red: [
    outerCircle,
    {
      border: "1px solid rgba(255, 0, 68, 0.02)",
      background:
        "linear-gradient(311deg, rgba(255, 0, 68, 0.06) -7.54%, rgba(255, 0, 68, 0.00) 123.57%)",
    },
  ],
});

const middleCircle = style({
  position: "absolute",
  width: "50px",
  height: "50px",
  borderRadius: "100%",
  boxSizing: "border-box",
  animation: `${expandFrom50To88} ${animationProps}`,
});
export const middleCircleVariants = styleVariants({
  blue: [
    middleCircle,
    {
      border: "1px solid rgba(42, 106, 255, 0.02)",
      background:
        "linear-gradient(311deg, rgba(42, 106, 255, 0.06) -7.54%, rgba(42, 106, 255, 0.00) 123.57%)",
    },
  ],
  red: [
    middleCircle,
    {
      border: "1px solid rgba(255, 0, 68, 0.02)",
      background:
        "linear-gradient(311deg, rgba(255, 0, 68, 0.06) -7.54%, rgba(255, 0, 68, 0.00) 123.57%)",
    },
  ],
});

const innerCircle = style({
  position: "absolute",
  width: "50px",
  height: "50px",
  borderRadius: "100%",
  boxSizing: "border-box",
  boxShadow: "32px 80px 116px 0px rgba(91, 140, 255, 0.10)",
  animation: `${expandFrom50To53} ${animationProps}`,
});
export const innerCircleVariants = styleVariants({
  blue: [
    innerCircle,
    {
      background:
        "linear-gradient(148deg, rgba(42, 106, 255, 0.86) 14.4%, rgba(42, 106, 255, 0.74) 87.37%)",
    },
  ],
  red: [
    innerCircle,
    {
      background:
        "linear-gradient(148deg, rgba(255, 0, 68, 0.86) 14.4%, rgba(255, 0, 68, 0.74) 87.37%)",
    },
  ],
});

export const content = style({
  position: "absolute",
});
