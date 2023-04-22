import {Theme} from "@emotion/react";

export const BG_COLOR_REGULAR = "#272727";
export const BG_COLOR_ADMIN = "#efb39c";
const BaseTheme = {
    fonts: {
        body: "Roboto, sans-serif",
        heading: "Roboto, sans-serif",
    }
}
export const AdminTheme: Theme = {
    ...BaseTheme,
    colors: {
        primary: BG_COLOR_ADMIN,
    },
}
export const RegularTheme: Theme = {
    ...BaseTheme,
    colors: {
        primary: BG_COLOR_REGULAR,
    }
}