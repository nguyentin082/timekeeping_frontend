import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Camera from '../screens/Camera';
import Register from '../screens/Register';
import Login from '../screens/Login';
import Splash from '../screens/Splash';
import { AuthContext } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

export type AppStackParamList = {
    Register: undefined;
    Login: undefined;
    Home: undefined;
    Camera: undefined;
    Splash: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const Navigation = () => {
    const { state }: any = useContext(AuthContext);

    if (!state) {
        throw new Error('AuthContext must be used within AuthProvider');
    }

    // Debug: Log state to verify token changes
    console.log('Auth State:', state);

    if (state.isLoading) {
        return <Splash />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {state.userToken == null ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={Register}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Home"
                            component={Home}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Camera"
                            component={Camera}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
