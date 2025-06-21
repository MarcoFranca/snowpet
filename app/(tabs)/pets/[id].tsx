// app/(tabs)/pets/[id].tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';

export default function PetDetailScreen() {
    const { id } = useLocalSearchParams();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalhe do Pet</Text>
            <Text style={styles.text}>ID: {id}</Text>
            <Text style={styles.text}>Detalhes do pet em breve!</Text>
            {/* Aqui entrará a visualização dos dados do pet */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 10 },
    text: { ...FontTokens.Body, color: Colors.textSecondary },
});
