import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';

export default function Welcome() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Animatable.Image
                source={require('@/assets/images/adaptive-icon.png')}
                animation="bounceIn"
                duration={1200}
                style={styles.logo}
            />

            <Text style={styles.title}>Bem-vindo ao{"\n"}<Text style={styles.highlight}>SnowPet</Text></Text>
            <Text style={styles.subtitle}>Seu aliado para cuidar{'\n'}do seu pet com amor.</Text>

            <Animatable.View animation="fadeInUp" delay={500} style={{ width: '100%' }}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/register')}>
                    <Text style={styles.primaryButtonText}>Criar Conta</Text>
                </TouchableOpacity>
            </Animatable.View>
            <Animatable.View animation="fadeInUp" delay={650} style={{ width: '100%' }}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/login')}>
                    <Text style={styles.secondaryButtonText}>Entrar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: Colors.primary,
        padding: 24,
    },
    logo: {
        height: 250, resizeMode: 'contain'
    },
    title: {
        ...FontTokens.H1, // Usa o seu token correto
        color: Colors.textInverse, textAlign: 'center', marginBottom: 8,
        lineHeight: 40,
    },
    highlight: {
        color: Colors.textInverse,
    },
    subtitle: {
        ...FontTokens.Subtitle, // Usa o token correto
        color: Colors.textSecondary, // ou Colors.textInverse se quiser claro
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 12,
        lineHeight: 26,
    },
    primaryButton: {
        width: '100%', maxWidth: 350, height: 56,
        backgroundColor: Colors.primaryDark, // um azul escuro do seu tema
        borderRadius: 8, justifyContent: 'center', alignItems: 'center',
        marginBottom: 16, elevation: 2,
    },
    primaryButtonText: {
        color: Colors.textInverse, ...FontTokens.Button,
    },
    secondaryButton: {
        width: '100%', maxWidth: 350, height: 56,
        backgroundColor: Colors.white,
        borderRadius: 8, justifyContent: 'center', alignItems: 'center',
        borderWidth: 1.5, borderColor: Colors.accent,
    },
    secondaryButtonText: {
        color: Colors.primary, ...FontTokens.Button,
    }
});
