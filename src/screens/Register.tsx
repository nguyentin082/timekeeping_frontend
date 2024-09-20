import {
    View,
    Text,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
} from 'react-native';
import React, { useState } from 'react';
import style from '../../constants/style';
import Brand from '../components/Brand';
import color from '../../constants/color';
import MyButtonText from '../components/ButtonText';
import { useLoadFonts } from '../hooks/useLoadFonts';
import Splash from './Splash';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyButtonTextOutline from '../components/ButtonTextOutline';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Navigation';
import {
    GestureHandlerRootView,
    NativeViewGestureHandler,
    ScrollView,
} from 'react-native-gesture-handler';
import axios from 'axios';
import Constants from 'expo-constants';

type RegisterProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, 'Register'>;
};

const REGISTER_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/user/register`;

const Register = ({ navigation }: RegisterProps) => {
    const fontsLoaded = useLoadFonts();
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [position, setPosition] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    if (!fontsLoaded) {
        return <Splash />; // Return a loading indicator if you prefer
    }

    const handleRegister = async () => {
        // Reformat dateofBirth to 'dd/mm/yyyy'
        const formattedDateOfBirth = dateOfBirth.toLocaleDateString('en-GB'); // 'en-GB' formats to dd/mm/yyyy

        // Check if any field is empty
        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword ||
            !formattedDateOfBirth ||
            !position
        ) {
            alert('All fields are required');
            return;
        }
        // Check password and confirmPassword match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // If all conditions are met, send a registration request to the server and navigate to the Home screen
        try {
            const response = await axios.post(REGISTER_ENDPOINT, {
                name: name,
                email: email,
                password: password,
                date_of_birth: formattedDateOfBirth,
                position: position,
            });
            // If the account is created successfully, navigate to login
            alert('Account created successfully. Please login!');
            navigation.navigate('Login');
        } catch (e: any) {
            // Handle the case where the email already exists (status 409)
            if (e.response && e.response.status === 409) {
                alert('This email is already in use.');
            } else {
                console.error(e);
                alert('An error occurred during registration.');
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
                <GestureHandlerRootView>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 justify-center"
                    >
                        <ScrollView className="flex-1 w-screen px-10 ">
                            {/* Login Form */}

                            {/* Title */}
                            <NativeViewGestureHandler
                                disallowInterruption={true}
                            >
                                <View className="mb-5">
                                    <Text
                                        className="text-xl self-center mb-10 mt-10"
                                        style={{
                                            fontFamily: 'ChakraPetch-Bold',
                                        }}
                                    >
                                        Create a new account
                                    </Text>
                                    <Text
                                        className="text-base"
                                        style={{
                                            fontFamily: 'Roboto-Bold',
                                            color: color.BLACK,
                                        }}
                                    >
                                        Your Name:
                                    </Text>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        keyboardAppearance="dark"
                                        className="border border-gray-300 rounded-lg text-base h-16 px-4 justify-items-center mb-2"
                                        style={{
                                            fontFamily: 'Roboto-Regular',
                                        }}
                                    />
                                    <View className="gap-3">
                                        <View className="flex-row">
                                            <Text
                                                className="text-base"
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    color: color.BLACK,
                                                }}
                                            >
                                                Date of Birth:
                                            </Text>
                                            {/* <TextInput
                                                value={dateOfBirth}
                                                onChangeText={setDateOfBirth}
                                                autoCapitalize="none"
                                                keyboardAppearance="dark"
                                                className="border border-gray-300 rounded-lg text-base h-16 px-4 justify-items-center mb-2"
                                                style={{
                                                    fontFamily:
                                                        'Roboto-Regular',
                                                }}
                                            /> */}
                                            <DateTimePicker
                                                value={dateOfBirth}
                                                mode="date"
                                                display="calendar"
                                                onChange={(
                                                    event,
                                                    selectedDate
                                                ) => {
                                                    if (selectedDate)
                                                        setDateOfBirth(
                                                            selectedDate
                                                        );
                                                }}
                                                style={{
                                                    flex: 1,
                                                }}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text
                                                className="text-base"
                                                style={{
                                                    fontFamily: 'Roboto-Bold',
                                                    color: color.BLACK,
                                                }}
                                            >
                                                Your Position:
                                            </Text>
                                            <TextInput
                                                value={position}
                                                onChangeText={setPosition}
                                                autoCapitalize="words"
                                                keyboardAppearance="dark"
                                                className="border border-gray-300 rounded-lg text-base h-16 px-4 justify-items-center mb-2"
                                                style={{
                                                    fontFamily:
                                                        'Roboto-Regular',
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <Text
                                        className="text-base"
                                        style={{
                                            fontFamily: 'Roboto-Bold',
                                            color: color.BLACK,
                                        }}
                                    >
                                        Your Email:
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
                                        Your Password:
                                    </Text>
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        keyboardAppearance="dark"
                                        className="border border-gray-300 rounded-lg text-base h-16 px-4 mb-2"
                                        secureTextEntry={true}
                                        textContentType="oneTimeCode"
                                    />
                                    <Text
                                        className="text-base"
                                        style={{
                                            fontFamily: 'Roboto-Bold',
                                            color: color.BLACK,
                                        }}
                                    >
                                        Retype Password:
                                    </Text>
                                    <TextInput
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        keyboardAppearance="dark"
                                        className="border border-gray-300 rounded-lg text-base h-16 px-4 "
                                        secureTextEntry={true}
                                        textContentType="oneTimeCode"
                                    />
                                </View>
                            </NativeViewGestureHandler>
                        </ScrollView>
                        <MyButtonText
                            buttonText="Submit"
                            handlePress={handleRegister}
                        />
                        <MyButtonTextOutline
                            buttonText="Back to login"
                            handlePress={() => navigation.navigate('Login')}
                        />
                    </KeyboardAvoidingView>
                </GestureHandlerRootView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Register;
