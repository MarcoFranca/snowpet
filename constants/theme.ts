import { AppTheme } from '@/types/theme';
import Colors, { DarkColors } from './Colors';
import { FontFamilies, FontWeights, FontSizes } from './Fonts';

export const lightTheme: AppTheme = {
    ...Colors,
    FontFamilies,
    FontWeights,
    FontSizes,
};

export const darkTheme: AppTheme = {
    ...DarkColors,
    FontFamilies,
    FontWeights,
    FontSizes,
};
