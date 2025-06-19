import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { lightTheme, darkTheme } from '@/constants/theme';

// Fontes:
import { useFonts as usePoppins, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { useFonts as useInter, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [poppinsLoaded] = usePoppins({ Poppins_700Bold });
    const [interLoaded] = useInter({ Inter_400Regular, Inter_700Bold });

    const fontsLoaded = poppinsLoaded && interLoaded;

    if (!fontsLoaded) return null;

    return (
        <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StyledThemeProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="auto" />
            </StyledThemeProvider>
        </NavThemeProvider>
    );
}
