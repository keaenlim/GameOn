import { Stack, useRouter } from "expo-router"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Colors } from "../constants/Colors"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../utils/firebaseConfig"
import 'react-native-get-random-values';
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

const AppLayout = () => {
    const { theme } = useTheme();
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading) {
            const currentPath = router.pathname;
            const isAuthRoute = currentPath === "/login" || currentPath === "/register";

            if (user) {
                if (isAuthRoute) {
                    router.replace("/");
                }
            } else {
                if (!isAuthRoute) {
                    router.replace("/login");
                }
            }
        }
    }, [user, loading, router.pathname]);

    const themeColors = Colors[theme] ?? Colors.light

    if (loading) {
        return null;
    }

    return (
        <>
            <StatusBar value="auto" />
            <Stack screenOptions={{
                headerStyle: { backgroundColor: themeColors.navBackground },
                headerTintColor: themeColors.title,
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => router.push('/settings')}
                        style={{ marginRight: 16 }}
                    >
                        <Ionicons name="person-circle-outline" size={28} color={themeColors.iconColor} />
                    </TouchableOpacity>
                ),
            }}>
                <Stack.Screen 
                    name="index" 
                    options={{ 
                        title: 'Home',
                        headerLeft: () => null,
                        headerBackVisible: false,
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen 
                    name="login" 
                    options={{ 
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen 
                    name="register" 
                    options={{ 
                        headerShown: false,
                        gestureEnabled: false
                    }}
                />
                <Stack.Screen name="create-match" options={{ title: 'Create Match' }}/>
                <Stack.Screen name="preferences" options={{ title: 'Preferences' }}/>
                <Stack.Screen name="find-matches" options={{ 
                    title: 'Find Matches',
                    headerLeft: () => null
                }}/>
                <Stack.Screen name="messages" options={{ 
                    title: 'Messages',
                    headerLeft: () => null
                }}/>
                <Stack.Screen name="settings" options={{
                    title: 'Settings',
                    headerRight: () => null
                }}/>
            </Stack>
        </>
    )
}

const RootLayout = () => {
    return (
        <ThemeProvider>
            <AppLayout />
        </ThemeProvider>
    )
}

export default RootLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    content: {
        flex: 1
    },
    footer: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#ddd'
    },
    footerText: {
        textAlign: 'center',
        color: '#666'
    }
})
