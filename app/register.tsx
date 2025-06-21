import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import FontTokens from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import PawIcon from '@/assets/icons/paw.svg';
import GoogleIcon from '@/assets/icons/google.svg';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '318399033671-3f5s01i0aud3cloq3q40vq5s5mlp7pqh.apps.googleusercontent.com',
        clientId: '318399033671-r1jn0cfuoeig89ics2f61bqesci2ac0p.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(FIREBASE_AUTH, credential)
                .then(() => router.replace('/(tabs)'))
                .catch((error) => Alert.alert('Erro no login', error.message));
        }
    }, [response]);

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert('Erro', 'Preencha e-mail e senha');
            return;
        }
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email.trim(), password);
            Alert.alert('Sucesso', 'Usuário criado com sucesso!');
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Erro no cadastro', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.container}>
                    <Animatable.Image
                        source={require('@/assets/images/adaptive-icon.png')}
                        animation="bounceIn"
                        duration={1200}
                        style={styles.logo}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                        <Text style={styles.title}>Cadastro no SnowPet</Text>
                        <Animatable.View
                            animation="pulse"
                            iterationCount="infinite"
                            duration={1800}
                            delay={700}
                            useNativeDriver
                        >
                            <PawIcon width={32} height={32} fill={Colors.white} style={{ marginLeft: -32 }} />
                        </Animatable.View>
                    </View>
                    <Text style={styles.subtitle}>Crie sua conta para começar a organizar a rotina do seu pet!</Text>

                    <Animatable.View animation="fadeInUp" delay={400} style={{ width: '100%' }}>
                        <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <GoogleIcon width={20} height={20} style={{ marginRight: 8 }} />
                                <Text style={styles.socialButtonText}>Continuar com Google</Text>
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={550} style={{ width: '100%' }}>
                        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#222' }]} disabled>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <AntDesign name="apple1" size={22} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={[styles.socialButtonText, { color: '#fff' }]}>Continuar com Apple (em breve)</Text>
                            </View>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={700} style={{ width: '100%' }}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>ou</Text>
                            <View style={styles.divider} />
                        </View>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={850} style={{ width: '100%' }}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            style={styles.input}
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={1000} style={{ width: '100%' }}>
                        <TextInput
                            placeholder="Senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            style={styles.input}
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={1150} style={{ width: '100%' }}>
                        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color={Colors.primaryDark} />
                            ) : (
                                <Text style={styles.buttonText}>Cadastrar</Text>
                            )}
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View animation="fadeInUp" delay={1300} style={{ width: '100%' }}>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={styles.linkText}>Já tem conta? Faça login</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { height: 180, resizeMode: 'contain', marginBottom: 12 },
    title: {
        ...FontTokens.H2,
        color: Colors.primaryDark,
        textAlign: 'center',
        marginBottom: 4,
        width: '80%',
    },
    subtitle: {
        ...FontTokens.Subtitle, // Adapte para Subtitle ou BodyBold conforme o seu tokens
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 18,
    },
    socialButton: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: Colors.white,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1.2,
        borderColor: Colors.border,
    },
    socialButtonText: {
        ...FontTokens.Button,
        color: Colors.text,
        fontWeight: "bold",
        fontSize: 16,
    },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
    divider: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: { marginHorizontal: 8, color: Colors.textSecondary, ...FontTokens.Body },
    input: {
        width: '100%',
        height: 50,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 10,
        backgroundColor: Colors.white,
        color: Colors.text,
        ...FontTokens.Body,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.primaryDark,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.textInverse,
        ...FontTokens.Button,
    },
    linkText: {
        color: Colors.primaryDark,
        ...FontTokens.Body,
        textAlign: 'center',
        marginTop: 14,
        textDecorationLine: 'underline'
    },
});
