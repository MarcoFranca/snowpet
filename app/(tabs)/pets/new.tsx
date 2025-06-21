// app/(tabs)/pets/new.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';

export default function PetFormScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro de Pet</Text>
            <Text style={styles.text}>Formulário de cadastro em breve!</Text>
            {/* Aqui entra o formulário futuramente */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 10 },
    text: { ...FontTokens.Body, color: Colors.textSecondary },
});
