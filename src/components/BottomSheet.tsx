import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Alert } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
    GestureHandlerRootView,
    ScrollView,
    NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import color from '../../constants/color';
import MyButtonIcon from './ButtonIcon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Navigation';
import Success from './Success';
import Fail from './Fail';
import * as Location from 'expo-location';
import { UserData, useUser } from '../context/UserContext';
import Constants from 'expo-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screens/Splash';

const { height, width } = Dimensions.get('window');

const IMAGE_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/image/cloudinary-upload`;
const TIMEKEEPING_ENDPOINT = `http://${Constants.expoConfig?.extra?.API_IP_ADDRESS}:3000/timekeeping`;

type BottomSheetProps = {
    updateState: (visible: boolean) => void;
    navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
    imageUri?: string;
    userData?: {
        name: string;
        email: string;
        date_of_birth: string;
        position: string;
        lastest_status: string;
    };
};

const MyBottomSheet = ({
    updateState,
    navigation,
    imageUri,
}: BottomSheetProps) => {
    // ref
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['88%'], []);
    const insets = useSafeAreaInsets();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isFail, setIsFail] = useState<boolean>(false);
    const [aspectRatio, setAspectRatio] = useState<number>(1);
    const [currentDate, setCurrentDate] = useState<string>('');
    const [currentTime, setCurrentTime] = useState<string>('');
    const [placeName, setPlaceName] = useState<string | null>(null);
    const aspectRatioCalculated = useRef<boolean>(false); // Ref to track if ratio is already calculated
    const { userData } = useUser();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageURL, setImageURL] = useState<string | null>(null);

    // Handle closing the BottomSheet and updating parent state
    const handleCloseBottomSheet = useCallback(() => {
        console.log('handleCloseBottomSheet');
        updateState(false);
        aspectRatioCalculated.current = false; // Reset aspect ratio calculation flag when closing
    }, [updateState]);

    const handleSubmit = useCallback(async () => {
        console.log('handleSubmit');
        console.log(placeName);

        setIsLoading(true);
        if (!imageUri || !placeName) {
            // Check if placeName is available
            console.log('No image URI or place name provided!');
            setIsLoading(false);
            return;
        }

        // Try block for upload image to Cloud Storage
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            } as any);

            // Add additional parameters to formData
            formData.append('formattedDate', currentDate);
            formData.append('formattedTime', currentTime);
            formData.append('userEmail', userData?.email || '');
            formData.append(
                'status',
                userData?.last_status === 'unknown'
                    ? 'Unknown'
                    : userData?.last_status === 'check-in'
                    ? 'check-out'
                    : 'check-in'
            );

            const imageUploadResponse = await axios.post(
                IMAGE_ENDPOINT,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (imageUploadResponse.status === 500) {
                console.log('Error uploading image:', imageUploadResponse);
                setIsFail(true);
                setTimeout(() => {
                    setIsFail(false);
                }, 2000);
            } else {
                const { secure_url } = imageUploadResponse.data;
                setImageURL(secure_url);

                // Try block for add entry to Timekeeping table in DB
                let data = {
                    status:
                        userData?.last_status === 'unknown'
                            ? 'Unknown'
                            : userData?.last_status === 'check-in'
                            ? 'check-out'
                            : 'check-in',
                    date: currentDate,
                    time: currentTime,
                    location: placeName,
                    imageURL: secure_url,
                };
                console.log(data);

                try {
                    const token = await AsyncStorage.getItem('@token');
                    const timekeepingResponse = await axios.post(
                        TIMEKEEPING_ENDPOINT,
                        data,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (timekeepingResponse.status === 500) {
                        console.log(
                            'Error adding entry to Timekeeping table:',
                            timekeepingResponse
                        );
                        setIsFail(true);
                        setTimeout(() => {
                            setIsFail(false);
                        }, 2000);
                    } else {
                        // console.log(
                        //     'Entry added to Timekeeping table:',
                        //     timekeepingResponse
                        // );
                        setIsSuccess(true);
                        setTimeout(() => {
                            setIsSuccess(false);
                            navigation.navigate('Home');
                        }, 2000);
                    }
                } catch (e) {
                    console.log('Error adding entry to Timekeeping table:', e);
                    setIsFail(true);
                    setTimeout(() => {
                        setIsFail(false);
                    }, 2000);
                }
            }
        } catch (e) {
            console.log('Error uploading image:', e);
            setIsFail(true);
            setTimeout(() => {
                setIsFail(false);
            }, 2000);
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    }, [imageUri, navigation, currentDate, currentTime, userData, placeName]);

    // Render backdrop for BottomSheet
    const renderBackdrop = useCallback((props: any) => {
        // console.log('renderBackdrop');
        return (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1} // Backdrop disappears when the sheet is closed
                appearsOnIndex={0} // Backdrop appears when the sheet opens
            />
        );
    }, []);

    useEffect(() => {
        if (imageUri && !aspectRatioCalculated.current) {
            let mounted = true;
            Image.getSize(imageUri, (imageWidth, imageHeight) => {
                if (mounted) {
                    const ratio = imageHeight / imageWidth;
                    setAspectRatio(ratio);
                    aspectRatioCalculated.current = true; // Mark as calculated
                    // console.log('Image ratio calculated:', ratio);
                }
            });
            return () => {
                mounted = false;
            };
        }
    }, [imageUri]);

    useEffect(() => {
        console.log('Get current date and time');

        const date = new Date();
        const formattedDate = [
            String(date.getDate()).padStart(2, '0'),
            String(date.getMonth() + 1).padStart(2, '0'),
            date.getFullYear(),
        ].join('/');
        const formattedTime = [
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            String(date.getSeconds()).padStart(2, '0'),
        ].join(':');
        setCurrentDate(formattedDate);
        setCurrentTime(formattedTime);
    }, []);

    useEffect(() => {
        console.log('Get current location');
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let locationResponse = await Location.getCurrentPositionAsync({});
            await fetchPlaceName(
                locationResponse.coords.latitude,
                locationResponse.coords.longitude
            );
        };

        getLocation();
    }, []);

    const fetchPlaceName = async (latitude: number, longitude: number) => {
        try {
            console.log('Calling API fetchPlaceName');
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            if (data && data.address) {
                const { road, suburb, city, country } = data.address;
                setPlaceName(
                    `${road ? road + ', ' : ''}${suburb ? suburb + ', ' : ''}${
                        city ? city + ', ' : ''
                    }${country}`
                );
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Failed to fetch place name');
        }
    };

    if (isSuccess) {
        return <Success />;
    }

    if (isFail) {
        return <Fail />;
    }

    // renders
    return (
        <GestureHandlerRootView
            className="absolute top-0"
            style={[{ height: height, width: width }, styles.container]}
        >
            <BottomSheet
                backgroundStyle={{
                    backgroundColor: color.CREAM,
                }}
                ref={bottomSheetRef}
                // onChange={handleSheetChanges}
                snapPoints={snapPoints}
                enablePanDownToClose={true} // Enable pan down to close
                onClose={handleCloseBottomSheet} // Handles closing
                backdropComponent={renderBackdrop} // Custom backdrop rendering
            >
                <BottomSheetView
                    style={[
                        styles.contentContainer,
                        { paddingBottom: insets.bottom },
                    ]}
                >
                    {/* Header */}
                    {/* HEADER */}
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {userData?.last_status === 'unknown'
                                ? 'Unknown'
                                : userData?.last_status === 'check-in'
                                ? 'CHECK-OUT'
                                : 'CHECK-IN'}
                        </Text>
                        <Text style={styles.subtitle}>
                            Company: {userData?.company_name}
                        </Text>
                    </View>
                    <NativeViewGestureHandler disallowInterruption={true}>
                        {isLoading ? (
                            <Splash />
                        ) : (
                            <ScrollView className="px-10 mb-5">
                                {/* Personal Info Section */}
                                <View className="mb-5">
                                    <View>
                                        <Text
                                            style={styles.contentTitle}
                                            className="text-lg"
                                        >
                                            Personal Information:
                                        </Text>
                                    </View>
                                    <View className="pl-5">
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Your Name: {userData?.name}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Your Email: {userData?.email}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Date of Birth:{' '}
                                            {userData?.date_of_birth}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Your position:{' '}
                                            {userData?.position}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Lastest status:{' '}
                                            {userData?.last_status === 'unknown'
                                                ? 'Unknown'
                                                : userData?.last_status ===
                                                  'check-in'
                                                ? 'Check-in'
                                                : 'Check-out'}{' '}
                                            ... at ...
                                        </Text>
                                    </View>
                                </View>
                                {/* Time Keeping Section */}
                                <View className="mb-5">
                                    <View>
                                        <Text
                                            style={styles.contentTitle}
                                            className="text-lg"
                                        >
                                            Time keeping Information:
                                        </Text>
                                    </View>
                                    <View className="pl-5">
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Status:{' '}
                                            {userData?.last_status === 'unknown'
                                                ? 'Unknown'
                                                : userData?.last_status ===
                                                  'check-in'
                                                ? 'Check-out'
                                                : 'Check-in'}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Date: {currentDate}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Time: {currentTime}
                                        </Text>
                                        <Text
                                            style={styles.contentText}
                                            className="text-base"
                                        >
                                            - Location:{' '}
                                            {placeName
                                                ? placeName
                                                : 'loading....'}
                                        </Text>
                                    </View>
                                </View>
                                {/* Image Review */}
                                <View>
                                    <Text
                                        style={styles.contentTitle}
                                        className="text-lg"
                                    >
                                        Review Image:
                                    </Text>
                                    {/* Display the image */}
                                    {imageUri && (
                                        <Image
                                            source={{ uri: imageUri }}
                                            style={[
                                                styles.image,
                                                {
                                                    aspectRatio:
                                                        1 / aspectRatio,
                                                },
                                            ]}
                                        />
                                    )}
                                </View>
                            </ScrollView>
                        )}
                    </NativeViewGestureHandler>
                    {/* Submit button */}
                    <MyButtonIcon
                        iconName="check-square-o"
                        handlePress={handleSubmit}
                        isDisable={
                            placeName && userData?.last_status !== 'unknown'
                                ? false
                                : true
                        }
                    />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
    },
    header: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    title: {
        fontFamily: 'Roboto-Bold',
        color: color.BLACK,
        fontSize: 24,
    },
    subtitle: {
        fontFamily: 'Roboto-Light',
        color: color.BLACK,
    },
    contentTitle: {
        fontFamily: 'Roboto-Bold',
        color: color.BLACK,
        marginTop: 10,
    },
    contentText: {
        fontFamily: 'Roboto-Regular',
        color: color.BLACK,
        marginBottom: 5,
    },
    image: {
        borderRadius: 10,
        marginTop: 10,
    },
});

export default MyBottomSheet;
