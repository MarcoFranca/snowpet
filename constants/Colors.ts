// constants/Colors.ts

/**
 * Paleta oficial de cores SnowPet App
 * Padrão para uso consistente em todo o projeto
 * Alinhado com dossiê, Figma e identidade visual
 */

export const Colors = {
  // Neutras
  white:    "#FFFFFF",
  black:    "#000000",
  background: "#F7F9FB",    // Fundo do app
  surface:    "#FFFFFF",    // Cards, campos, etc.
  border:     "#E0E4EA",    // Bordas e divisores

  // Primárias
  primary:      "#7CD1F9",  // Azul claro principal
  secundary:    "#00AEEF",
  primaryDark:  "#2A64A6",  // Azul escuro (textos, contraste)
  accent:       "#FFC1DA",  // Rosa/pêssego

  // Texto
  text:           "#222A35", // Texto principal
  textSecondary:  "#687076", // Texto secundário/subtítulo
  textInverse:    "#FFFFFF", // Para botões ou fundos escuros

  // Feedback
  success: "#39C09B",  // Verde
  warning: "#FFDF7C",  // Amarelo
  error:   "#FF8181",  // Vermelho

  // Outras variações (opcional)
  info:    "#33C9FF",  // Azul de informação
  shadow:  "#00000010", // Sombra leve
  pawYellow: "#FFE08A",
};

// Para Dark Mode (opcional — use quando quiser)
export const DarkColors = {
  ...Colors,
  background: "#181F27",
  surface: "#232E3C",
  text: "#F1F6FA",
  textSecondary: "#A1A9B7",
  border: "#2D3C50",
  shadow: "#00000050",
};

export default Colors;
