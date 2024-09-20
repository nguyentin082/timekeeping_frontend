import {
    View,
    Text,
    SafeAreaView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useContext, useState } from 'react';
import style from '../../constants/style';
import color from '../../constants/color';
import MyButtonText from '../components/ButtonText';
import Brand from '../components/Brand';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Navigation';
import { useLoadFonts } from '../hooks/useLoadFonts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import Splash from './Splash';
import { AuthContext } from '../context/AuthContext';
import MyButtonTextOutline from '../components/ButtonTextOutline';

type LoginProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, 'Login'>;
};

const { height, width } = Dimensions.get('window');
const LOGIN_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/user/login`;

const Login = ({ navigation }: LoginProps) => {
    const fontsLoaded = useLoadFonts();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authContext = useContext(AuthContext); // Access AuthContext

    if (!fontsLoaded) {
        return <Splash />; // Return a loading indicator if you prefer
    }

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email and password are required');
            return;
        }

        try {
            const response = await axios.post(LOGIN_ENDPOINT, {
                email,
                password,
            });

            // Save tokens and user data to context or state management by AsyncStorage
            const { token, refreshToken } = response.data;

            await AsyncStorage.setItem('@token', token);
            await AsyncStorage.setItem('@refreshToken', refreshToken);

            // If the login is successful, clear the form inputs
            setEmail('');
            setPassword('');

            // Update AuthContext with the new token
            if (authContext) {
                await authContext.signIn(token);
            }

            // Navigate to the home screen or another screen
            navigation.navigate('Home');
        } catch (error: any) {
            if (error.response) {
                // Server responded with a status other than 200
                const status = error.response.status;
                const message = error.response.data.message || 'Login failed';

                if (status === 401) {
                    Alert.alert('Login Failed', message); // Invalid email or password
                } else {
                    Alert.alert('Error', message); // Other server-side errors
                }
            } else if (error.request) {
                // No response received from server (network error)
                Alert.alert('Error', 'Network error, please try again');
            } else {
                // Other errors (e.g., error in setting up the request)
                Alert.alert('Error', 'Something went wrong, please try again');
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
                style={style.background}
                className="flex-1 items-center"
            >
                <Brand />
                <View className="flex-1 w-screen px-10 justify-center">
                    {/* Login Form */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 justify-center"
                    >
                        {/* Title */}
                        <View className="mb-5">
                            <Text
                                className="text-xl self-center mb-10"
                                style={{ fontFamily: 'ChakraPetch-Bold' }}
                            >
                                Login to your account
                            </Text>
                            <Text
                                className="text-base"
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    color: color.BLACK,
                                }}
                            >
                                Email:
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                keyboardAppearance="dark"
                                className="border border-gray-300 rounded-lg text-base h-16 px-4 justify-items-center mb-2"
                                style={{
                                    fontFamily: 'Roboto-Regular',
                                }}
                            />
                            <Text
                                className="text-base"
                                style={{
                                    fontFamily: 'Roboto-Bold',
                                    color: color.BLACK,
                                }}
                            >
                                Password:
                            </Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                keyboardAppearance="dark"
                                className="border border-gray-300 rounded-lg text-base h-16 px-4 "
                                secureTextEntry
                            />
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <MyButtonText buttonText="Login" handlePress={handleLogin} />
                <MyButtonTextOutline
                    buttonText="Create an account"
                    handlePress={() => navigation.navigate('Register')}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Login;
