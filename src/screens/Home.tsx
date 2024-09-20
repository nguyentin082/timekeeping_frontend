import { View, Text, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Brand from '../components/Brand';
import color from '../../constants/color';
import style from '../../constants/style';
import CompanyList from '../components/CompanyList';
import { useLoadFonts } from '../hooks/useLoadFonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Navigation';
import MyButtonText from '../components/ButtonText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import Splash from './Splash';
import { useUser } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';

type HomeProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
};

type UserData = {
    id: number;
    name: string;
    email: string;
    date_of_birth: string;
    position: string;
    last_status: string;
    company_name: string;
};

const HOME_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/user/my-info`;
const LOGOUT_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/user/logout`;
const REFRESH_TOKEN_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/user/refresh-token`;

const fetchData = async () => {
    console.log('Defined fetch user data function');

    try {
        const token = await AsyncStorage.getItem('@token');
        const response = await axios.get(HOME_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log(response.data.user);
        return response.data.user;
    } catch (e) {
        console.error(e);
        return null; //
    }
};

// Function to refresh token
const refreshToken = async () => {
    try {
        const storedRefreshToken = await AsyncStorage.getItem('@refreshToken');
        if (!storedRefreshToken) throw new Error('Refresh token not found');

        const response = await axios.post(REFRESH_TOKEN_ENDPOINT, {
            refreshToken: storedRefreshToken, // Send the refresh token in the body
        });

        // Store new token (and optionally a new refreshToken if your backend rotates it)
        await AsyncStorage.setItem('@token', response.data.token);
        if (response.data.refreshToken) {
            await AsyncStorage.setItem(
                '@refreshToken',
                response.data.refreshToken
            );
        }

        Alert.alert('Success', 'Token refreshed successfully');
    } catch (e) {
        console.error('Failed to refresh token:', e);
        Alert.alert('Error', 'Failed to refresh token');
    }
};

const Home = ({ navigation }: HomeProps) => {
    const fontsLoaded = useLoadFonts();
    const { userData, setUserData } = useUser();
    const authContext = useContext<any>(AuthContext); // Access AuthContext
    const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

    useEffect(() => {
        console.log('Fetching user data');

        const loadData = async () => {
            try {
                let user = userData;

                if (!user) {
                    // Attempt to fetch user data
                    user = await fetchData();

                    if (!user) {
                        console.log('User data not found, refreshing token...');
                        const refreshResult: any = await refreshToken();

                        if (!refreshResult) {
                            // If refresh token fails, navigate to login
                            Alert.alert(
                                'Error',
                                'Session expired. Please log in again.'
                            );
                            await authContext.signOut(); // Sign out in AuthContext
                            setUserData(null);
                            navigation.navigate('Login');
                            return;
                        }

                        // Try fetching data again after token refresh
                        user = await fetchData();

                        if (!user) {
                            // If fetching user data still fails, log the user out
                            Alert.alert(
                                'Error',
                                'Failed to load user data. Please log in again.'
                            );
                            await authContext.signOut(); // Sign out in AuthContext
                            setUserData(null);
                            navigation.navigate('Login');
                            return;
                        }
                    }

                    // Set user data if fetching succeeded
                    setUserData(user);
                }
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Failed to load data. Please try again.');
            } finally {
                setIsLoading(false); // Ensure loading state is set to false
            }
        };

        loadData();
    }, [userData]);

    if (!fontsLoaded || isLoading) {
        return <Splash />; // Return a loading indicator if you prefer
    }

    const handleShowToken = async () => {
        const token = await AsyncStorage.getItem('@token');
        const refreshToken = await AsyncStorage.getItem('@refreshToken');
        // console.log(token);
        // console.log(refreshToken);
        // console.log(userData);
    };

    const handleLogout = async () => {
        try {
            console.log('Logging out...');

            // Attempt to get and send logout request
            const token = await AsyncStorage.getItem('@token');
            if (token) {
                await axios.post(
                    LOGOUT_ENDPOINT,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // Clear token and refreshToken
            await AsyncStorage.removeItem('@token');
            await AsyncStorage.removeItem('@refreshToken');

            // Sign out in AuthContext
            if (authContext) {
                await authContext.signOut();
            }

            // Reset userData and navigate to login
            setUserData(null);
            navigation.navigate('Login');
        } catch (e) {
            console.error('Error logging out:', e);
            Alert.alert('Error', 'Failed to log out');
        }
    };

    return (
        <SafeAreaView style={style.background} className="flex-1 items-center">
            <Brand />
            <Text
                className="text-base mt-10 mb-3"
                style={{ fontFamily: 'Roboto-Medium', color: color.BLACK }}
            >
                Choose your company to Check in or Check out
            </Text>
            <CompanyList
                navigation={navigation}
                companyName={userData?.company_name}
                lastStatus={userData?.last_status}
            />
            <View className="items-center my-3">
                <Text
                    style={{ fontFamily: 'Roboto-Light', color: color.BLACK }}
                >
                    Your name: {userData?.name}
                </Text>
                <Text style={{ fontFamily: 'Roboto-Thin', color: color.BLACK }}>
                    Your position: {userData?.position}
                </Text>
                <Text
                    style={{ fontFamily: 'Roboto-Light', color: color.BLACK }}
                >
                    Your email: {userData?.email}
                </Text>
            </View>
            <MyButtonText
                buttonText="ShowToken"
                handlePress={handleShowToken}
            />
            <MyButtonText buttonText="Logout" handlePress={handleLogout} />
        </SafeAreaView>
    );
};

export default Home;
