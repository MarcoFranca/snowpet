import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';

export default function HomeScreen() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
                <ActivityIndicator color="#00AEEF" size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Button title="Sair" color="#FF2D55" onPress={handleLogout} />
            <Text style={styles.title}>Meus Pets 🐾</Text>

            <FlatList
                data={pets}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.petCard}>
                        <Text style={styles.petName}>{item.name}</Text>
                        <Text style={styles.petSpecies}>{item.species}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ gap: 12 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Nenhum pet cadastrado ainda.
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#00AEEF' },
    petCard: { backgroundColor: '#f2f2f2', padding: 16, borderRadius: 10 },
    petName: { fontSize: 18, fontWeight: 'bold' },
    petSpecies: { fontSize: 14, color: '#555' },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
