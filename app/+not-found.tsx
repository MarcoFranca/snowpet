import { Link, Stack } from 'expo-router';
import { styled } from 'styled-components/native';
import { AppTheme } from '@/types/theme'; // <- Tipagem manual que criamos

const Container = styled.View<{ theme: AppTheme }>`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: ${({ theme }) => theme.background};
`;

const Title = styled.Text<{ theme: AppTheme }>`
    font-family: ${({ theme }) => theme.FontFamilies.title};
    font-size: ${({ theme }) => theme.FontSizes.xl}px;
    font-weight: ${({ theme }) => theme.FontWeights.bold};
    color: ${({ theme }) => theme.primaryDark};
`;

const GoHome = styled.Text<{ theme: AppTheme }>`
    margin-top: 15px;
    padding-top: 15px;
    padding-bottom: 15px;
    font-family: ${({ theme }) => theme.FontFamilies.text};
    color: ${({ theme }) => theme.primary};
    font-weight: ${({ theme }) => theme.FontWeights.bold};
    font-size: ${({ theme }) => theme.FontSizes.md}px;
`;

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!' }} />
            <Container>
                <Title>Esta tela não existe.</Title>
                <Link href="/">
                    <GoHome>Ir para a tela inicial!</GoHome>
                </Link>
            </Container>
        </>
    );
}
