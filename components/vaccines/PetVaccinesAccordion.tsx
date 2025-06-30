import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { FIREBASE_DB } from '@/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Colors } from '@/constants/Colors';
import FontTokens from '@/constants/Fonts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AddVaccineModal } from './AddVaccineModal'; // Caminho correto!

export function PetVaccinesAccordion({ petId }: { petId: string }) {
    const [vacinas, setVacinas] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!petId) return;
        const q = query(collection(FIREBASE_DB, 'vaccinesCard'), where('petId', '==', petId));
        const unsub = onSnapshot(q, (snap) => {
            setVacinas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, [petId]);

    // Helper para status visual
    const getStatus = (vacina: any) => {
        const now = new Date();
        const validUntil = vacina.validUntil?.toDate ? vacina.validUntil.toDate() : new Date(vacina.validUntil);
        if (validUntil < now) return 'vencida';
        if (validUntil.getTime() - now.getTime() < 15 * 24 * 60 * 60 * 1000) return 'vence_15dias';
        return 'ok';
    };

    // Ordena por data de aplicação (mais recente primeiro)
    const sortedVacinas = [...vacinas].sort((a, b) =>
        (b.date?.toDate?.() || new Date(b.date)).getTime() - (a.date?.toDate?.() || new Date(a.date)).getTime()
    );

    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity onPress={() => setOpen(!open)} style={styles.accordionHeader}>
                <MaterialCommunityIcons name="needle" size={22} color={Colors.primaryDark} />
                <Text style={styles.accordionTitle}>Vacinas</Text>
                <MaterialCommunityIcons name={open ? "chevron-up" : "chevron-down"} size={24} color={Colors.primaryDark} />
            </TouchableOpacity>

            {open && (
                <View style={styles.accordionContent}>
                    {sortedVacinas.length === 0 ? (
                        <Text style={styles.noData}>Nenhuma vacina registrada ainda.</Text>
                    ) : (
                        sortedVacinas.map(item => (
                            <View
                                key={item.id}
                                style={[
                                    styles.card,
                                    getStatus(item) === 'vencida' && { borderColor: Colors.error },
                                    getStatus(item) === 'vence_15dias' && { borderColor: Colors.warning }
                                ]}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.vacinaName}>{item.vaccineName}</Text>
                                    <Text style={styles.vacinaDate}>
                                        Aplicação: {item.date?.toDate ? item.date.toDate().toLocaleDateString('pt-BR') : '-'}
                                        {"\n"}Validade: {item.validUntil?.toDate ? item.validUntil.toDate().toLocaleDateString('pt-BR') : '-'}
                                    </Text>
                                    {item.vetName ? (
                                        <Text style={styles.vetName}>Vet: {item.vetName}</Text>
                                    ) : null}
                                    {item.notes ? (
                                        <Text style={styles.obs}>{item.notes}</Text>
                                    ) : null}
                                </View>
                                {item.documentURL ?
                                    <Image source={{ uri: item.documentURL }} style={styles.comprovante} />
                                    : null}
                            </View>
                        ))
                    )}


                    {/* BOTÃO DE ADICIONAR VACINA */}
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
                        <MaterialCommunityIcons name="plus" size={18} color={Colors.primaryDark} />
                        <Text style={styles.addText}>Adicionar Vacina</Text>
                    </TouchableOpacity>

                    {/* MODAL DE ADICIONAR VACINA */}
                    <AddVaccineModal visible={modalOpen} onClose={() => setModalOpen(false)} petId={petId} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    accordionContainer: { marginBottom: 10, backgroundColor: Colors.surface, borderRadius: 8, overflow: 'hidden' },
    accordionHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    accordionTitle: { ...FontTokens.Subtitle, color: Colors.primaryDark, flex: 1, marginLeft: 6 },
    accordionContent: { padding: 8 },
    card: { borderWidth: 2, borderColor: Colors.primary, borderRadius: 8, padding: 10, marginBottom: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background },
    vacinaName: { ...FontTokens.BodyBold, color: Colors.primaryDark },
    vacinaDate: { ...FontTokens.Caption, color: Colors.textSecondary },
    vetName: { ...FontTokens.Caption, color: Colors.primary },
    obs: { ...FontTokens.Caption, color: Colors.warning, fontStyle: 'italic' },
    comprovante: { width: 40, height: 40, borderRadius: 6, marginLeft: 10 },
    noData: { ...FontTokens.Body, color: Colors.textSecondary, textAlign: 'center', marginVertical: 12 },
    addButton: { marginTop: 8, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', backgroundColor: Colors.pawYellow, padding: 8, borderRadius: 7, gap: 7 },
    addText: { ...FontTokens.Button, color: Colors.primaryDark }
});
