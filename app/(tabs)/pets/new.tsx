// app/(tabs)/pets/new.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';
import { useRouter } from 'expo-router';
import {addDoc, collection, doc, updateDoc} from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { uploadPetImage } from '@/services/uploadImage';

const speciesList = ['Cão', 'Gato', 'Outro'];
const sizeList = ['Pequeno', 'Médio', 'Grande'];

export default function PetFormScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        species: '',
        breed: '',
        birthDate: null as Date | null,
        size: '',
        weight: '',
        height: '',
        photoURL: '',
        allergies: '', // depois transformar em array
        notes: '',
    });
    const [loading, setLoading] = useState(false);

    // Handle image picking
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });
        if (!result.canceled && result.assets.length > 0) {
            setForm({ ...form, photoURL: result.assets[0].uri }); // <-- correto!
        }
    };
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.species || !form.size) {
            Alert.alert('Preencha os campos obrigatórios (Nome, Espécie e Porte).');
            return;
        }
        setLoading(true);
        try {
            const userId = FIREBASE_AUTH.currentUser?.uid;
            if (!userId) throw new Error("Usuário não autenticado.");

            // 1. Cria o doc no Firestore sem a foto
            const petDoc = await addDoc(collection(FIREBASE_DB, 'pets'), {
                ...form,
                photoURL: '', // vazio por enquanto
                weight: Number(form.weight),
                height: Number(form.height),
                allergies: form.allergies
                    .split(',')
                    .map(a => a.trim())
                    .filter(Boolean),
                birthDate: form.birthDate,
                ownerId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const petId = petDoc.id;

            // 2. Faz upload da imagem se existir
            let photoDownloadURL = '';
            if (form.photoURL && form.photoURL.startsWith('file://')) {
                photoDownloadURL = await uploadPetImage(form.photoURL, userId, petId);
                // 3. Atualiza o doc com a URL da foto
                await updateDoc(doc(FIREBASE_DB, 'pets', petId), {
                    photoURL: photoDownloadURL,
                    updatedAt: new Date(),
                });
            }

            Alert.alert('Pet cadastrado com sucesso!');
            router.replace('/'); // volta para Home
        } catch (error: any) {
            Alert.alert('Erro ao salvar pet', error.message || String(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={styles.title}>Cadastro de Pet</Text>

                {/* Foto */}
                <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                    {form.photoURL ? (
                        <Image source={{ uri: form.photoURL }} style={styles.photo} />
                    ) : (
                        <Text style={styles.photoText}>Selecionar foto</Text>
                    )}
                </TouchableOpacity>

                {/* Nome */}
                <TextInput
                    placeholder="Nome do pet *"
                    style={styles.input}
                    value={form.name}
                    onChangeText={v => handleChange('name', v)}
                    placeholderTextColor={Colors.textSecondary}
                />

                {/* Espécie */}
                <View style={styles.selectRow}>
                    {speciesList.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            style={[
                                styles.selectBtn,
                                form.species === opt && styles.selectBtnActive
                            ]}
                            onPress={() => handleChange('species', opt)}
                        >
                            <Text style={[styles.selectText, form.species === opt && styles.selectTextActive]}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Raça */}
                <TextInput
                    placeholder="Raça"
                    style={styles.input}
                    value={form.breed}
                    onChangeText={v => handleChange('breed', v)}
                    placeholderTextColor={Colors.textSecondary}
                />

                {/* Data de nascimento */}
                <View style={{ marginBottom: 10 }}>
                    <Text style={{ ...FontTokens.Body, color: Colors.text, marginBottom: 2 }}>Data de nascimento *</Text>
                    <TouchableOpacity
                        style={[styles.input, { justifyContent: 'center', minHeight: 48 }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={{ color: form.birthDate ? Colors.text : Colors.textSecondary }}>
                            {form.birthDate ? form.birthDate.toLocaleDateString('pt-BR') : 'Selecione a data'}
                        </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={showDatePicker}
                        mode="date"
                        date={form.birthDate || new Date()}
                        maximumDate={new Date()}
                        onConfirm={date => {
                            setShowDatePicker(false);
                            setForm({ ...form, birthDate: date });
                        }}
                        onCancel={() => setShowDatePicker(false)}
                        locale="pt-BR"
                    />
                </View>

                {/* Porte */}
                <View style={styles.selectRow}>
                    {sizeList.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            style={[
                                styles.selectBtn,
                                form.size === opt && styles.selectBtnActive
                            ]}
                            onPress={() => handleChange('size', opt)}
                        >
                            <Text style={[styles.selectText, form.size === opt && styles.selectTextActive]}>
                                {opt}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Peso */}
                <TextInput
                    placeholder="Peso (kg)"
                    style={styles.input}
                    value={form.weight}
                    onChangeText={v => handleChange('weight', v)}
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                />

                {/* Altura */}
                <TextInput
                    placeholder="Altura (cm)"
                    style={styles.input}
                    value={form.height}
                    onChangeText={v => handleChange('height', v)}
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="numeric"
                />

                {/* Alergias */}
                <TextInput
                    placeholder="Alergias (opcional)"
                    style={styles.input}
                    value={form.allergies}
                    onChangeText={v => handleChange('allergies', v)}
                    placeholderTextColor={Colors.textSecondary}
                />

                {/* Observações */}
                <TextInput
                    placeholder="Observações (opcional)"
                    style={[styles.input, { minHeight: 40 }]}
                    value={form.notes}
                    onChangeText={v => handleChange('notes', v)}
                    placeholderTextColor={Colors.textSecondary}
                    multiline
                />

                {/* Botão */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Salvando...' : 'Cadastrar Pet'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, padding: 22 },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 16, textAlign: 'center' },

    photoContainer: {
        alignSelf: 'center',
        width: 96,
        height: 96,
        borderRadius: 60,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: Colors.primary,
        overflow: 'hidden'
    },
    photo: { width: '100%', height: '100%', borderRadius: 60 },
    photoText: { color: Colors.primary, ...FontTokens.Body },

    input: {
        width: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        ...FontTokens.Body,
        color: Colors.text,
    },

    selectRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    selectBtn: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.surface,
        borderRadius: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center'
    },
    selectBtnActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primaryDark,
    },
    selectText: { ...FontTokens.Body, color: Colors.textSecondary },
    selectTextActive: { color: Colors.primaryDark, fontWeight: 'bold' },

    button: {
        marginTop: 20,
        backgroundColor: Colors.primaryDark,
        paddingVertical: 13,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: { color: Colors.textInverse, ...FontTokens.Button },
});
