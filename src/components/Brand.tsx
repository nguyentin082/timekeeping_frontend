import { View, Text } from 'react-native';
import React, { useCallback } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useLoadFonts } from '../hooks/useLoadFonts';
import color from '../../constants/color';

const Brand = () => {
    const fontsLoaded = useLoadFonts();

    if (!fontsLoaded) {
        return null; // Return a loading indicator if you prefer
    }

    return (
        <View className="flex-row justify-center">
            <View className="justify-center mr-3">
                <AntDesign name="clockcircleo" size={90} color={color.BLACK} />
            </View>
            <View className="">
                <Text
                    className=""
                    style={{
                        fontFamily: 'ChakraPetch-Bold',
                        fontSize: 60,
                        color: color.BLACK,
                    }}
                >
                    CHECK
                </Text>
                <Text
                    className=""
                    style={{
                        fontFamily: 'Roboto-ThinItalic',
                        fontSize: 15,
                        letterSpacing: 10,
                        color: color.BLACK,
                    }}
                >
                    for employee
                </Text>
            </View>
        </View>
    );
};

export default Brand;
