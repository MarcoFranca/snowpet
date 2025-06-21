// app/(tabs)/care.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';

export default function CareScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vacinas & Cuidados</Text>
            <Text style={styles.text}>Em breve você poderá cadastrar vacinas, vermífugos e outros cuidados!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 10 },
    text: { ...FontTokens.Body, color: Colors.textSecondary },
});
