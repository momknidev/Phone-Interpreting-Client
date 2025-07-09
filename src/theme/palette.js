import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#586EDC',
  light: '#586EDC',
  main: '#586EDC',
  dark: '#586EDC',
  darker: '#586EDC',
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#DC254E',
  light: '#DC254E',
  main: '#DC254E',
  dark: '#DC254E',
  darker: '#DC254E',
  contrastText: '#FFFFFF',
};
const SECONDARY_OTHER = {
  lighter: '#FFB40C',
  light: '#FFB40C',
  main: '#FFB40C',
  dark: '#FFB40C',
  darker: '#FFB40C',
  contrastText: '#FFFFFF',
};
const INFO = {
  lighter: '#301400',
  light: '#301400',
  main: '#301400',
  dark: '#301400',
  darker: '#301400',
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#D8FBDE',
  light: '#86E8AB',
  main: '#36B37E',
  dark: '#1B806A',
  darker: '#0A5554',
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#F0E6DC',
  light: '#F0E6DC',
  main: '#F0E6DC',
  dark: '#F0E6DC',
  darker: '#F0E6DC',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};
const BLUE = {
  lighter: '#E6F0FF',
  light: '#A3C8FF',
  main: '#0052CC',
  dark: '#003DA5',
  darker: '#002B80',
  contrastText: '#FFFFFF',
};
const PURPLE = {
  lighter: '#F5F0FF',
  light: '#EAB8FF',
  main: '#A100FF',
  dark: '#6A00E0',
  darker: '#3C00B0',
  contrastText: '#FFFFFF',
};
const GREEN = {
  lighter: '#E6FFED',
  light: '#A3FFC4',
  main: '#00875A',
  dark: '#006644',
  darker: '#004B36',
  contrastText: '#FFFFFF',
};
const YELLOW = {
  lighter: '#FFFBEA',
  light: '#FFE380',
  main: '#FFC400',
  dark: '#B58100',
  darker: '#7A4F00',
  contrastText: GREY[800],
};

const COMMON = {
  common: { black: '#000000', white: '#FFFFFF' },
  primary: PRIMARY,
  secondary: SECONDARY,
  secondaryOther: SECONDARY_OTHER,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  blue: BLUE,
  purple: PURPLE,
  green: GREEN,
  yellow: YELLOW,
  divider: alpha(GREY[500], 0.24),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default function palette(themeMode) {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: GREY[800],
      secondary: GREY[600],
      disabled: GREY[500],
    },
    background: { paper: '#FFFFFF', default: '#FFFFFF', neutral: GREY[200] },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#FFFFFF',
      secondary: GREY[500],
      disabled: GREY[600],
    },
    background: {
      paper: GREY[800],
      default: GREY[900],
      neutral: alpha(GREY[500], 0.16),
    },
    action: {
      ...COMMON.action,
      active: GREY[500],
    },
  };

  return themeMode === 'light' ? light : dark;
}
