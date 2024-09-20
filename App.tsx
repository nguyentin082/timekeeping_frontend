import React from 'react';
import { Text, View } from 'react-native';
import Navigation from './src/navigation/Navigation';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';

export default function App() {
    return (
        <AuthProvider>
            <UserProvider>
                <Navigation />
            </UserProvider>
        </AuthProvider>
    );
}
