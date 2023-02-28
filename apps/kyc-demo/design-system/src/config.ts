import { PartialBentoConfig } from "@buildo/bento-design-system";

export const config: PartialBentoConfig = {
  actions: {
    buttonsAlignment: "right",
    spaceBetweenButtons: 16,
    primaryActionButtonKind: "solid",
    primaryPosition: "right",
    secondaryActionButtonKind: "transparent",
  },
  areaLoader: {
    scrimColor: "light",
    messageSize: "medium",
    messageColor: "primary",
    readabilityAreaColor: "primary",
    readabilityAreaBorderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    radius: "circled",
    labelSize: "large",
    iconSize: 16,
  },
  banner: {
    paddingX: 16,
    paddingY: 16,
    radius: 8,
    titleSize: "small",
    descriptionSize: "small",
    closeIconSize: 12,
    semanticIconSize: {
      withoutTitle: 16,
      withTitle: 24,
    },
    buttonKind: "transparent",
    buttonSize: "small",
  },
  breadcrumb: {
    fontSize: "medium",
    separatorSize: 8,
    space: 16,
  },
  button: {
    paddingX: {
      small: 8,
      medium: 16,
      large: 16,
    },
    paddingY: {
      small: 4,
      medium: 8,
      large: 16,
    },
    labelSize: "large",
    radius: 8,
    internalSpacing: 8,
    iconSize: {
      small: 12,
      medium: 12,
      large: 16,
    },
    uppercaseLabel: false,
  },
  card: {},
  chip: {
    paddingX: 8,
    paddingY: 4,
    labelSize: "small",
    iconSize: 12,
    closeIconSize: 8,
    spacingAfterIcon: 4,
    spacingAfterLabel: 8,
    radius: "circledX",
  },
  dateField: {
    radius: 8,
    padding: 24,
    elevation: "medium",
    monthYearLabelSize: "large",
    dayOfWeekLabelSize: "large",
    dayHeight: 40,
    dayWidth: 40,
    daySize: "medium",
  },
  decorativeDivider: {
    color: "brandSecondary",
    height: 2,
    radius: "circledX",
  },
  disclosure: {
    internalSpacing: 16,
    defaultIconPosition: "trailing",
    titleSize: {
      "1": "medium",
      "2": "small",
    },
    iconSize: {
      "1": 16,
      "2": 12,
    },
  },
  disclosureGroup: {
    defaultIconPosition: "leading",
    disclosureSpacing: 24,
    groupSpacing: 40,
  },
  dropdown: {},
  feedback: {
    illustrationSize: {
      large: 80,
      medium: 40,
    },
    title: {
      large: {
        size: "large",
        kind: "title",
      },
      medium: "small",
    },
    descriptionSize: {
      large: "medium",
      medium: "small",
    },
    action: {
      large: {
        kind: "solid",
        hierarchy: "primary",
        size: "large",
      },
      medium: {
        kind: "transparent",
        hierarchy: "primary",
        size: "medium",
      },
    },
    maxWidth: {
      large: 440,
      medium: 280,
    },
  },
  field: {
    label: {
      size: "small",
      color: "secondary",
    },
    assistiveText: {
      size: "small",
      paddingLeft: 16,
    },
    internalSpacing: 4,
    tip: {
      iconSize: 12,
    },
  },
  formLayout: {
    form: {
      headerTitle: {
        kind: "display",
        size: "small",
      },
      headerDescriptionSize: "medium",
      formSpacing: 40,
      headerSpacing: 16,
      defaultActionsSize: "large",
    },
    row: {
      rowSpacing: 16,
    },
    section: {
      sectionTitleSize: "large",
      sectionDescriptionSize: "medium",
      sectionHeaderSpacing: 8,
      sectionSpacing: 24,
    },
  },
  iconButton: {
    padding: {
      "8": 8,
      "12": 8,
      "16": 16,
      "24": 16,
    },
    radius: 8,
  },
  inlineLoader: {
    messageSize: "medium",
    spinnerIconSize: 16,
  },
  input: {
    internalSpacing: 16,
    paddingX: 16,
    paddingY: 16,
    radius: 8,
    fontSize: "medium",
    passwordIconSize: 16,
  },
  list: {},
  menu: {},
  modal: {
    elevation: "large",
    titleSize: "medium",
    titleIconSize: 24,
    closeIconSize: 12,
    width: {
      small: 400,
      medium: 560,
      large: 720,
      wide: 1000,
    },
  },
  navigation: {
    activeVisualElement: {
      lineColor: "brandPrimary",
      lineHeight: {
        medium: 4,
        large: 4,
      },
    },
    destinationPaddingX: {
      medium: 16,
      large: 24,
    },
    destinationPaddingY: {
      medium: 8,
      large: 16,
    },
    destinationsSpacing: 0,
    iconSize: {
      medium: 16,
      large: 16,
    },
    illustrationSize: {
      medium: 24,
      large: 24,
    },
    labelSize: {
      medium: "medium",
      large: "large",
    },
    uppercaseLabel: false,
    internalSpacing: {
      medium: 8,
      large: 8,
    },
  },
  progressBar: {},
  searchBar: {},
  selectionControl: {
    group: {
      internalSpacing: {
        vertical: 16,
        horizontal: 24,
      },
    },
    element: {
      controlLabelSpacing: 8,
      labelSize: "medium",
    },
  },
  slider: {},
  stepper: {},
  table: {},
  tabs: {},
  toast: {},
  tooltip: {},
};
