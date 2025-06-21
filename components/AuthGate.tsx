import { ReactNode, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebaseConfig';

export const AuthGate = ({ children }: { children: ReactNode }) => {
    const [isAuthChecked, setAuthChecked] = useState(false);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            const currentSegment = segments[0];
            const authRoutes = ['login', 'register', 'welcome'];

            if (user && authRoutes.includes(currentSegment)) {
                router.replace('/(tabs)');
            } else if (!user && !authRoutes.includes(currentSegment)) {
                router.replace('/welcome');
            }
            setAuthChecked(true);
        });

        return unsubscribe;
    }, [segments]);

    if (!isAuthChecked) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00AEEF" />
            </View>
        );
    }

    return <>{children}</>;
};

