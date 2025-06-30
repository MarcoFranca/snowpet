// components/vaccines/AddVaccineModal.tsx

import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { addDoc, collection } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '@/firebaseConfig';

export function AddVaccineModal({ visible, onClose, petId }: { visible: boolean, onClose: () => void, petId: string }) {
    const [form, setForm] = useState({
        vaccineName: '',
        date: null as Date | null,
        validUntil: null as Date | null,
        vetName: '',
        notes: '',
    });
    const [showDatePicker, setShowDatePicker] = useState<'aplic' | 'valid' | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string | Date) => setForm(f => ({ ...f, [field]: value }));

    const handleSubmit = async () => {
        if (!form.vaccineName || !form.date || !form.validUntil) {
            Alert.alert('Preencha nome, data de aplicação e validade');
            return;
        }
        setLoading(true);
        try {
            const userId = FIREBASE_AUTH.currentUser?.uid;
            if (!userId) throw new Error('Usuário não autenticado!');
            console.log('userId (Firebase Auth):', userId);
            console.log('petId (Firebase Auth):', petId);
            await addDoc(collection(FIREBASE_DB, 'vaccinesCard'), {
                ...form,
                date: form.date,
                validUntil: form.validUntil,
                petId,
                ownerId: userId,  // ← ESSENCIAL: Isso precisa ser o mesmo do request.auth.uid!
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setForm({
                vaccineName: '',
                date: null,
                validUntil: null,
                vetName: '',
                notes: '',
            });
            onClose();
        } catch (err: any) {
            Alert.alert('Erro ao salvar', err.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>Adicionar Vacina</Text>

                    <TextInput
                        placeholder="Nome da vacina *"
                        style={styles.input}
                        value={form.vaccineName}
                        onChangeText={v => handleChange('vaccineName', v)}
                        placeholderTextColor={Colors.textSecondary}
                    />
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker('aplic')}
                    >
                        <Text style={{ color: form.date ? Colors.text : Colors.textSecondary }}>
                            {form.date ? form.date.toLocaleDateString('pt-BR') : 'Data de aplicação *'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowDatePicker('valid')}
                    >
                        <Text style={{ color: form.validUntil ? Colors.text : Colors.textSecondary }}>
                            {form.validUntil ? form.validUntil.toLocaleDateString('pt-BR') : 'Validade *'}
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Veterinário"
                        style={styles.input}
                        value={form.vetName}
                        onChangeText={v => handleChange('vetName', v)}
                        placeholderTextColor={Colors.textSecondary}
                    />
                    <TextInput
                        placeholder="Observações"
                        style={styles.input}
                        value={form.notes}
                        onChangeText={v => handleChange('notes', v)}
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 10 }}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={loading}>
                            <Text style={styles.saveText}>{loading ? "Salvando..." : "Salvar"}</Text>
                        </TouchableOpacity>
                    </View>

                    <DateTimePickerModal
                        isVisible={showDatePicker === 'aplic'}
                        mode="date"
                        date={form.date || new Date()}
                        maximumDate={new Date()}
                        onConfirm={date => {
                            setShowDatePicker(null);
                            handleChange('date', date);
                        }}
                        onCancel={() => setShowDatePicker(null)}
                        locale="pt-BR"
                    />
                    <DateTimePickerModal
                        isVisible={showDatePicker === 'valid'}
                        mode="date"
                        date={form.validUntil || new Date()}
                        onConfirm={date => {
                            setShowDatePicker(null);
                            handleChange('validUntil', date);
                        }}
                        onCancel={() => setShowDatePicker(null)}
                        locale="pt-BR"
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
    modalBox: { width: '92%', backgroundColor: Colors.surface, borderRadius: 12, padding: 22 },
    title: { ...FontTokens.H2, color: Colors.primaryDark, marginBottom: 14 },
    input: {
        width: '100%',
        backgroundColor: Colors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 10,
        ...FontTokens.Body,
        color: Colors.text,
    },
    saveBtn: { backgroundColor: Colors.primaryDark, borderRadius: 7, padding: 10 },
    saveText: { ...FontTokens.Button, color: Colors.textInverse },
    cancelBtn: { backgroundColor: Colors.surface, borderRadius: 7, padding: 10, borderWidth: 1, borderColor: Colors.border },
    cancelText: { ...FontTokens.Button, color: Colors.primaryDark },
});

