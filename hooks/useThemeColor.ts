import { Colors, DarkColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors
) {
  const scheme = useColorScheme() ?? 'light';
  const colorFromProps = props[scheme];

  // Usa cor vinda dos props (se existir), senão pega do token
  if (colorFromProps) return colorFromProps;

  // Seleciona paleta conforme tema
  const themeColors = scheme === 'dark' ? DarkColors : Colors;
  return themeColors[colorName];
}
