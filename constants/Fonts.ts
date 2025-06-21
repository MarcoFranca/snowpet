// constants/Fonts.ts

export const FontFamilies = {
    title: "Poppins",
    text: "Nunito",
};

export const FontWeights = {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "900",
};

export const FontSizes = {
    caption: 11, // Para legendas, textos muito pequenos, opt-ins, termos, etc.
    xs: 12,      // Ajuda/contexto, campos pequenos
    sm: 14,      // Label, texto secundário
    base: 16,    // Texto normal
    md: 18,      // Botão, destaque leve
    lg: 22,      // Subtítulo forte
    xl: 28,      // Título principal
    xxl: 34,     // Hero, título gigante
};

// constants/Fonts.ts

/**
 * Tipografia padrão SnowPet
 * Segue padrão tokens para fácil uso no código e alinhamento visual com Figma/Design System
 */

export const FontTokens = {
    // Títulos (Poppins)
    H1:    { fontFamily: "Poppins_800ExtraBold", fontSize: 34, lineHeight: 40 },
    H2:    { fontFamily: "Poppins_700Bold", fontSize: 28, lineHeight: 34 },
    H3:    { fontFamily: "Poppins_700Bold", fontSize: 22, lineHeight: 28 },

    // Subtítulo/Destaque (Nunito)
    Subtitle:   { fontFamily: "Nunito_700Bold", fontSize: 20, lineHeight: 26 },
    Highlight:  { fontFamily: "Nunito_700Bold", fontSize: 18, lineHeight: 24 },

    // Texto principal (Nunito)
    Body:       { fontFamily: "Nunito_400Regular", fontSize: 16, lineHeight: 24 },
    BodyItalic: { fontFamily: "Nunito_400Regular_Italic", fontSize: 16, lineHeight: 24 },
    BodyBold:   { fontFamily: "Nunito_700Bold", fontSize: 16, lineHeight: 24 },
    Small:      { fontFamily: "Nunito_400Regular", fontSize: 14, lineHeight: 20 },
    Caption:    { fontFamily: "Nunito_400Regular", fontSize: 12, lineHeight: 16 },

    // Citação (Nunito Italic)
    Quote:      { fontFamily: "Nunito_400Regular_Italic", fontSize: 16, lineHeight: 24, fontStyle: "italic" },

    // Botões
    Button:     { fontFamily: "Nunito_700Bold", fontSize: 16, lineHeight: 20 },
    ButtonSm:   { fontFamily: "Nunito_700Bold", fontSize: 14, lineHeight: 18 },
};

/**
 * Exemplo de uso:
 * <Text style={FontTokens.H1}>Título principal</Text>
 * <Text style={FontTokens.Body}>Texto normal</Text>
 * <Text style={FontTokens.Caption}>Mensagem auxiliar pequena</Text>
 */

export default FontTokens;
