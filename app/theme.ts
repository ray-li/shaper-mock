import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Palette {
        custom: {
            offWhite: string;
            darkBlue: string;
        };
    }
    interface PaletteOptions {
        custom?: {
            offWhite?: string;
            darkBlue?: string;
        };
    }
}

const theme = createTheme({
    typography: {
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    },
    palette: {
        primary: {
            main: "rgb(0, 56, 209)",
        },
        // Add custom colors
        custom: {
            offWhite: "#f5f5f5",
            darkBlue: "#0a1929",
        }
    }
})

export default theme;