import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import color from '../../constants/color';

const MyButtonTextOutline = ({ buttonText, handlePress }: any) => {
    return (
        <View className="w-screen mt-3">
            <TouchableOpacity
                className=" mx-10 rounded-2xl"
                style={{
                    backgroundColor: color.CREAM,
                    borderColor: color.SAGE_GREEN,
                    borderWidth: 1,
                }}
                onPress={handlePress}
            >
                <Text
                    className="py-4 text-lg text-center"
                    style={{
                        fontFamily: 'ChakraPetch-Bold',
                        color: color.SAGE_GREEN,
                    }}
                >
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MyButtonTextOutline;
