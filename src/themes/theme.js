import { createTheme } from "@mui/material/styles";
export const appTheme = createTheme({
  palette: {
    mode: "light",

    //Color del footer
    primary: {
      main: "#16537e",
    },

    //Color del texto del año
    secondary: {
      main: "#ffffff", 
    },

    //Color del navbar
    primaryLight: {
      main: "#16537e",

      //Color del texto sobre el navbar
      contrastText: "#ffffff",
    },
  },
});
