import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import color from '../../constants/color';
import { useLoadFonts } from '../hooks/useLoadFonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Navigation';

type CompanyListProps = {
    navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
    companyName: string | undefined;
    lastStatus: string | undefined;
};

const CompanyList = ({
    navigation,
    companyName,
    lastStatus,
}: CompanyListProps) => {
    const fontsLoaded = useLoadFonts();

    if (!fontsLoaded) {
        return null; // Return a loading indicator if you prefer
    }

    return (
        <ScrollView className="w-screen px-10">
            <TouchableOpacity
                className="flex-row h-16 items-center"
                style={{ backgroundColor: color.CHAMPAGNE }}
                onPress={() => navigation.navigate('Camera')}
            >
                {/* Status */}
                <View
                    className="h-5 w-5 rounded-full ml-10 mr-5"
                    style={{
                        backgroundColor:
                            lastStatus === 'unknown'
                                ? 'gray'
                                : lastStatus === 'check-in'
                                ? color.GREEN_ACTIVE
                                : color.RED_INACTIVE,
                    }}
                ></View>
                {/* Company Name */}
                <Text
                    className="text-lg"
                    style={{
                        fontFamily: 'ChakraPetch-Medium',
                        color: color.BLACK,
                    }}
                >
                    {companyName}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CompanyList;
