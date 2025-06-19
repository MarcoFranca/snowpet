// constants/Fonts.ts

export const FontFamilies = {
    title: "Poppins",
    text: "Inter",
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
    H1:    { fontFamily: "Poppins_700Bold", fontSize: 34, lineHeight: 40 },
    H2:    { fontFamily: "Poppins_700Bold", fontSize: 28, lineHeight: 34 },
    H3:    { fontFamily: "Poppins_700Bold", fontSize: 22, lineHeight: 28 },

    // Texto principal (Inter)
    Body:      { fontFamily: "Inter_400Regular", fontSize: 16, lineHeight: 24 },
    BodyBold:  { fontFamily: "Inter_700Bold",    fontSize: 16, lineHeight: 24 },
    Small:     { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
    Caption:   { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 16 },

    // Botões
    Button:    { fontFamily: "Inter_700Bold", fontSize: 16, lineHeight: 20 },
    ButtonSm:  { fontFamily: "Inter_700Bold", fontSize: 14, lineHeight: 18 },
};

/**
 * Exemplo de uso:
 * <Text style={FontTokens.H1}>Título principal</Text>
 * <Text style={FontTokens.Body}>Texto normal</Text>
 * <Text style={FontTokens.Caption}>Mensagem auxiliar pequena</Text>
 */

export default FontTokens;
