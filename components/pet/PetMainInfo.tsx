import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';

export function PetMainInfo({ pet }: { pet: any }) {
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
        <View style={styles.header}>
            {pet.photoURL ? (
                <Image source={{ uri: pet.photoURL }} style={styles.photo} />
            ) : (
                <View style={styles.photoPlaceholder}>
                    <MaterialCommunityIcons name="dog" size={52} color={Colors.primary} />
                </View>
            )}
            <Text style={styles.title}>{pet.name}</Text>
            <Text style={styles.species}>{pet.species} • {pet.breed}</Text>
            <Text style={styles.sub}>{pet.birthDate && `Idade: ${getAgeString(pet.birthDate)}`}</Text>

            <View style={styles.infoRow}>
                <View style={styles.infoCol}>
                    <Text style={styles.label}>Porte</Text>
                    <Text style={styles.value}>{pet.size}</Text>
                </View>
                <View style={styles.infoCol}>
                    <Text style={styles.label}>Peso (kg)</Text>
                    <Text style={styles.value}>{pet.weight}</Text>
                </View>
                <View style={styles.infoCol}>
                    <Text style={styles.label}>Altura (cm)</Text>
                    <Text style={styles.value}>{pet.height}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Alergias</Text>
                <Text style={styles.value}>
                    {pet.allergies && pet.allergies.length > 0
                        ? Array.isArray(pet.allergies)
                            ? pet.allergies.join(', ')
                            : String(pet.allergies)
                        : 'Nenhuma'}
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Observações</Text>
                <Text style={styles.value}>{pet.notes || 'Nenhuma'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { alignItems: 'center', marginBottom: 22 },
    photo: { width: 96, height: 96, borderRadius: 60, marginBottom: 10 },
    photoPlaceholder: {
        width: 96, height: 96, borderRadius: 60, backgroundColor: Colors.surface,
        alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderWidth: 2, borderColor: Colors.primary
    },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 2, textAlign: 'center' },
    species: { ...FontTokens.BodyBold, color: Colors.textSecondary, marginBottom: 3 },
    sub: { ...FontTokens.Body, color: Colors.textSecondary, marginBottom: 10, textAlign: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 6, gap: 4 },
    infoCol: { flex: 1, alignItems: 'center' },
    label: { ...FontTokens.Small, color: Colors.textSecondary, marginBottom: 2 },
    value: { ...FontTokens.Body, color: Colors.primaryDark, marginBottom: 4 },
    section: { width: '100%', marginBottom: 8 },
});
