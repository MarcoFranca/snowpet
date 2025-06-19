export interface AppTheme {
    white: string;
    black: string;
    background: string;
    surface: string;
    border: string;
    primary: string;
    primaryDark: string;
    accent: string;
    text: string;
    textSecondary: string;
    textInverse: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    shadow: string;

    FontFamilies: {
        title: string;
        text: string;
    };
    FontWeights: {
        regular: string;
        medium: string;
        semibold: string;
        bold: string;
        extrabold: string;
    };
    FontSizes: {
        caption: number;
        xs: number;
        sm: number;
        base: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
}
