// app/(tabs)/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const icons = {
    "Adicionar Pet": "plus-circle-outline",
    "Vacinas": "needle",
    "Cuidados": "stethoscope",
    "Documentos": "file-document-outline",
};

export default function HomeScreen() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const userName = FIREBASE_AUTH.currentUser?.displayName || 'Tutor';

    const handleLogout = async () => {
        await signOut(FIREBASE_AUTH);
        router.replace('/welcome');
    };

    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            try {
                const userId = FIREBASE_AUTH.currentUser?.uid;
                if (!userId) return;

                const petsQuery = query(
                    collection(FIREBASE_DB, 'pets'),
                    where('ownerId', '==', userId)
                );
                const snapshot = await getDocs(petsQuery);
                const petsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPets(petsList);
            } catch (error) {
                console.error(error);
                setPets([]);
            }
            setLoading(false);
        };

        fetchPets();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={Colors.primary} size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ marginTop:16, paddingBottom: 36 }}>
            {/* Header com mascote e saudação */}
            <View style={styles.header}>
                <Image source={require('@/assets/icons/mascot_snow.png')} style={styles.mascot} />
                <Text style={styles.greeting}>Olá, {userName}!</Text>
                <Text style={styles.subGreeting}>O Snow está aqui para ajudar no cuidado do seu pet 🐾</Text>
            </View>

            {/* Atalhos rápidos */}
            <View style={styles.quickActions}>
                <HomeShortcutButton
                    label="Adicionar Pet"
                    onPress={() => router.push('/pets/new')}
                    icon={<MaterialCommunityIcons name="plus-circle-outline" size={28} color={Colors.pawYellow} />}
                />
                <HomeShortcutButton
                    label="Vacinas"
                    onPress={() => router.push('/care?filter=vacina')}
                    icon={<MaterialCommunityIcons name="needle" size={28} color={Colors.pawYellow} />}
                />
                <HomeShortcutButton
                    label="Cuidados"
                    onPress={() => router.push('/care')}
                    icon={<MaterialCommunityIcons name="stethoscope" size={28} color={Colors.pawYellow} />}
                />
                <HomeShortcutButton
                    label="Documentos"
                    onPress={() => router.push('/documents')}
                    icon={<MaterialCommunityIcons name="file-document-outline" size={28} color={Colors.pawYellow} />}
                />
            </View>

            {/* Listagem dos pets do usuário */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meus Pets</Text>
                <FlatList
                    data={pets}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.petCard}
                                          onPress={() => router.push({
                                              pathname: '/pets/[id]', params: { id: item.id } })}
                        >
                            <Text style={styles.petName}>{item.name}</Text>
                            <Text style={styles.petSpecies}>{item.species}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            Nenhum pet cadastrado ainda. Toque em &quot;Adicionar Pet&quot;!
                        </Text>
                    }
                    contentContainerStyle={{ gap: 12 }}
                />
            </View>

            {/* Mensagem positiva do mascote */}
            <View style={styles.mascotMessage}>
                <Text style={styles.mascotMessageText}>
                    “Cuidar do seu pet é um ato de amor! Conte comigo sempre que precisar.” 💙
                </Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

type HomeShortcutButtonProps = {
    label: string;
    onPress: () => void;
    icon:  React.ReactNode;
    activeOpacity?: number; // adicione essa linha!
};

const HomeShortcutButton = ({ label, onPress, icon, activeOpacity = 0.85 }: HomeShortcutButtonProps) => (
    <TouchableOpacity style={styles.shortcutButton} onPress={onPress} activeOpacity={activeOpacity}>
        {icon}
        <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 18,
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginTop: 22, marginBottom: 10 },
    mascot: { width: 82, height: 82, marginBottom: 10 },
    greeting: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 2 },
    subGreeting: { ...FontTokens.Body, color: Colors.textSecondary, textAlign: 'center', marginBottom: 8 },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
        gap: 12,
    },
    shortcutButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.primaryDark, // azul claro
        marginHorizontal: 2,
        minWidth: 76,
        minHeight: 76,
        maxWidth: 92,
        elevation: 2,
        shadowColor: Colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    shortcutIcon: {
        fontSize: 26,
        marginBottom: 4,
        color: Colors.primaryDark,
    },
    shortcutLabel: {
        ...FontTokens.Small,
        color: Colors.textInverse,
        textAlign: 'center',
        maxWidth: 72,
    },
    section: { marginBottom: 18 },
    sectionTitle: { ...FontTokens.H3, color: Colors.primaryDark, marginBottom: 6 },
    petCard: { backgroundColor: Colors.surface, padding: 14, borderRadius: 12, alignItems: 'center', marginRight: 6 },
    petName: { ...FontTokens.BodyBold, color: Colors.primaryDark },
    petSpecies: { ...FontTokens.Caption, color: Colors.textSecondary },
    emptyText: { ...FontTokens.Body, color: Colors.textSecondary, fontStyle: 'italic', marginTop: 16, alignItems: "center", maxWidth: '100%' },
    mascotMessage: { backgroundColor: Colors.pawYellow, borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 20 },
    mascotMessageText: { ...FontTokens.Subtitle, color: Colors.primaryDark, textAlign: 'center' },
    logoutButton: { marginTop: 10, alignSelf: 'center', padding: 8 },
    logoutText: { ...FontTokens.Button, color: Colors.error },
});
