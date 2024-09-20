import {
    View,
    Text,
    SafeAreaView,
    Button,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Navigation';
import { useLoadFonts } from '../hooks/useLoadFonts';
import style from '../../constants/style';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import AntDesign from '@expo/vector-icons/AntDesign';
import color from '../../constants/color';
import MyButtonIcon from '../components/ButtonIcon';
import MyBottomSheet from '../components/BottomSheet';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useUser } from '../context/UserContext';

type CameraProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
};

const { height, width } = Dimensions.get('window');
const maskRowHeight = Math.round((height - 200) / 20);
const maskColWidth = (width - 200) / 2;

const Camera = ({ navigation }: CameraProps) => {
    const fontsLoaded = useLoadFonts();
    const [facing, setFacing] = useState<CameraType>('front');
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] =
        useState<boolean>(false);
    const [capturedPhotoUri, setCapturedPhotoUri] = useState<
        string | undefined
    >(undefined); // Add state for photo URI
    const { userData } = useUser();

    // Avoid rendering camera hooks conditionally
    if (!fontsLoaded) {
        return null;
    }

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button title="Grant permission" onPress={requestPermission} />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            _rotate90andFlip(photo);
        }
    };

    const _rotate90andFlip = async (image: any) => {
        const manipResult = await manipulateAsync(
            image.localUri || image.uri,
            [{ rotate: 180 }, { flip: FlipType.Vertical }],
            { compress: 1, format: SaveFormat.PNG }
        );
        setCapturedPhotoUri(manipResult.uri);
    };

    // const toggleCameraFacing = () => {
    //     setFacing((current) => (current === 'back' ? 'front' : 'back'));
    // };

    const handleBottomSheetVisible = () => {
        setIsBottomSheetVisible((current) => !current);
    };

    const handleCapture = () => {
        takePicture();
        handleBottomSheetVisible();
    };

    return (
        <SafeAreaView style={[style.background, styles.container]}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <AntDesign name="arrowleft" size={30} color={color.BLACK} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>CAPTURE YOUR FACE</Text>
                    <Text style={styles.subtitle}>
                        Company: {userData?.company_name}
                    </Text>
                </View>
            </View>

            {/* Camera View */}
            <View style={[{ flex: 1 }]}>
                <CameraView
                    style={styles.camera}
                    facing={facing}
                    ref={setCameraRef}
                >
                    <View style={styles.maskOutter}>
                        <View
                            style={[
                                { flex: 40 },
                                styles.maskRow,
                                styles.maskFrame,
                            ]}
                        />
                        <View style={[{ flex: 70 }, styles.maskCenter]}>
                            <View
                                style={[
                                    { width: maskColWidth },
                                    styles.maskFrame,
                                ]}
                            />
                            <View style={styles.maskInner}>
                                <View style={styles.cornerTopLeft} />
                                <View style={styles.cornerTopRight} />
                                <View style={styles.cornerBottomLeft} />
                                <View style={styles.cornerBottomRight} />
                            </View>
                            <View
                                style={[
                                    { width: maskColWidth },
                                    styles.maskFrame,
                                ]}
                            />
                        </View>
                        <View
                            style={[
                                { flex: maskRowHeight },
                                styles.maskRow,
                                styles.maskFrame,
                            ]}
                        />
                    </View>
                </CameraView>
            </View>

            {/* Capture button */}
            <MyButtonIcon
                iconName="camera"
                handlePress={handleCapture}
                isDisable={userData?.last_status === 'unknown' ? true : false}
            />

            {/* Bottom Sheet */}
            {isBottomSheetVisible && (
                <MyBottomSheet
                    updateState={handleBottomSheetVisible}
                    navigation={navigation}
                    imageUri={capturedPhotoUri}
                />
            )}
        </SafeAreaView>
    );
};

export default Camera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    backButton: {
        marginHorizontal: 16,
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
    message: {
        fontFamily: 'Roboto-Light',
        color: color.BLACK,
        textAlign: 'center',
    },
    camera: { flex: 1, width: '90%', margin: 20 },
    maskOutter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    maskInner: {
        width: 300,
        backgroundColor: 'transparent',
    },
    maskFrame: {
        opacity: 0.7,
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: {
        flexDirection: 'row',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderColor: color.CREAM,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 30,
        height: 30,
        borderColor: color.CREAM,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 30,
        height: 30,
        borderColor: color.CREAM,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderColor: color.CREAM,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
});
