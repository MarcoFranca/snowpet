import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView, Image, ActivityIndicator , SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { uploadPetImage } from '@/services/uploadImage';


const speciesList = ['Cão', 'Gato', 'Outro'];
const sizeList = ['Pequeno', 'Médio', 'Grande'];

export default function PetEditScreen() {
    const { id } = useLocalSearchParams();
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
        allergies: '',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchPet = async () => {
            setLoading(true);
            try {
                const petRef = doc(FIREBASE_DB, 'pets', String(id));
                const snapshot = await getDoc(petRef);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setForm({
                        name: data.name || '',
                        species: data.species || '',
                        breed: data.breed || '',
                        birthDate: data.birthDate?.toDate ? data.birthDate.toDate() : (data.birthDate ? new Date(data.birthDate) : null),
                        size: data.size || '',
                        weight: data.weight ? String(data.weight) : '',
                        height: data.height ? String(data.height) : '',
                        photoURL: data.photoURL || '',
                        allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : (data.allergies || ''),
                        notes: data.notes || '',
                    });
                }
            } catch (err) {}
            setLoading(false);
        };
        fetchPet();
    }, [id]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });
        if (!result.canceled && result.assets.length > 0) {
            setForm({ ...form, photoURL: result.assets[0].uri });
        }
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!form.name || !form.species || !form.size) {
            Alert.alert('Preencha os campos obrigatórios (Nome, Espécie e Porte).');
            return;
        }
        setSaving(true);
        try {
            const petId = Array.isArray(id) ? id[0] : id;
            const petRef = doc(FIREBASE_DB, 'pets', String(petId));
            const userId = FIREBASE_AUTH.currentUser?.uid;
            if (!userId) throw new Error('Usuário não autenticado.');

            let photoDownloadURL = form.photoURL;

            // Só faz upload se mudou a imagem (file://)
            if (form.photoURL && form.photoURL.startsWith('file://')) {
                photoDownloadURL = await uploadPetImage(form.photoURL, userId, petId);
            }

            await updateDoc(petRef, {
                ...form,
                photoURL: photoDownloadURL,
                weight: Number(form.weight),
                height: Number(form.height),
                allergies: form.allergies
                    .split(',')
                    .map(a => a.trim())
                    .filter(Boolean),
                birthDate: form.birthDate,
                updatedAt: new Date(),
            });

            Alert.alert('Pet atualizado com sucesso!');
            router.replace({ pathname: '/pets/[id]', params: { id: petId } });
        } catch (error: any) {
            Alert.alert('Erro ao salvar alterações', error.message || String(error));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={Colors.primary} size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                    <Text style={styles.title}>Editar Pet</Text>

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
                    <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
                        <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background, paddingTop: 40, paddingHorizontal: 20 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
