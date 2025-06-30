import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Alert , SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';
import {FIREBASE_AUTH, FIREBASE_DB} from '@/firebaseConfig';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PetVaccinesAccordion } from '@/components/vaccines/PetVaccinesAccordion'; // Ou o caminho onde salvar o componente
import { PetMainInfo } from '@/components/pet/PetMainInfo';
import { deletePetImage } from '@/services/uploadImage';



export default function PetDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [pet, setPet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchPet = async () => {
            setLoading(true);
            try {
                const petRef = doc(FIREBASE_DB, 'pets', String(id));
                const userId = FIREBASE_AUTH.currentUser?.uid;
                console.log('ID do usuário logado:', userId);
                console.log('Buscando documento do pet:', String(id));
                const snapshot = await getDoc(petRef);
                if (snapshot.exists()) {
                    const petData = snapshot.data();
                    console.log('Dados do pet:', petData);
                    setPet({ id: snapshot.id, ...petData });
                }
                else {
                    setPet(null);
                }
            } catch (err) {
                setPet(null);
            }
            setLoading(false);
        };
        fetchPet();
    }, [id]);

    const handleDelete = async () => {
        Alert.alert(
            "Remover Pet",
            "Tem certeza que deseja excluir este pet? Essa ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Busca o documento antes de remover
                            const petRef = doc(FIREBASE_DB, 'pets', String(id));
                            const snapshot = await getDoc(petRef);
                            const data = snapshot.data();
                            // Deleta imagem se existir
                            if (data?.photoURL) {
                                await deletePetImage(data.photoURL);
                            }
                            // Deleta documento
                            await deleteDoc(petRef);
                            router.replace('/');
                        } catch (e) {
                            Alert.alert('Erro ao excluir', 'Tente novamente');
                        }
                    }
                }
            ]
        );
    };


    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={Colors.primary} size="large" />
            </View>
        );
    }

    if (!pet) {
        return (
            <View style={styles.center}>
                <Text style={styles.title}>Pet não encontrado!</Text>
            </View>
        );
    }

    // Função para calcular idade
    const getAgeString = (birthDate: any) => {
        if (!birthDate) return '';
        const date = birthDate.toDate ? birthDate.toDate() : new Date(birthDate);
        const now = new Date();
        let years = now.getFullYear() - date.getFullYear();
        let months = now.getMonth() - date.getMonth();
        if (months < 0) { years -= 1; months += 12; }
        return `${years} ano(s)${months > 0 ? ` e ${months} mês(es)` : ''}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <PetMainInfo pet={pet} />
                <PetVaccinesAccordion petId={pet.id} />

                {/* Botões de ação */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push({ pathname: '/pets/[id]/edit', params: { id: pet.id } })}
                    >
                        <MaterialCommunityIcons name="pencil-outline" size={22} color={Colors.primaryDark} />
                        <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                        <MaterialCommunityIcons name="trash-can-outline" size={22} color={Colors.error} />
                        <Text style={styles.deleteText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingTop: 40, paddingHorizontal: 20 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 22 },
    photo: { width: 96, height: 96, borderRadius: 60, marginBottom: 10 },
    photoPlaceholder: {
        width: 96, height: 96, borderRadius: 60, backgroundColor: Colors.surface,
        alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 2, borderColor: Colors.primary
    },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 2, textAlign: 'center' },
    species: { ...FontTokens.BodyBold, color: Colors.textSecondary, marginBottom: 3 },
    sub: { ...FontTokens.Body, color: Colors.textSecondary, marginBottom: 10, textAlign: 'center' },

    section: { marginBottom: 12 },
    sectionRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
    label: { ...FontTokens.Small, color: Colors.textSecondary, marginBottom: 2 },
    value: { ...FontTokens.Body, color: Colors.primaryDark, marginBottom: 4 },
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28, gap: 22 },
    editButton: {
        flexDirection: 'row', alignItems: 'center', padding: 12,
        borderRadius: 10, backgroundColor: Colors.pawYellow, gap: 7,
    },
    editText: { ...FontTokens.Button, color: Colors.primaryDark },
    deleteButton: {
        flexDirection: 'row', alignItems: 'center', padding: 12,
        borderRadius: 10, backgroundColor: '#fff6f6', gap: 7,
        borderWidth: 1, borderColor: Colors.error
    },
    deleteText: { ...FontTokens.Button, color: Colors.error },
});
