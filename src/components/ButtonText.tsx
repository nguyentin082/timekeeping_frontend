import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import color from '../../constants/color';

const MyButtonText = ({ buttonText, handlePress }: any) => {
    return (
        <View className="w-screen mt-3">
            <TouchableOpacity
                className=" mx-10 rounded-2xl"
                style={{ backgroundColor: color.SAGE_GREEN }}
                onPress={handlePress}
            >
                <Text
                    className="py-4 text-lg text-center"
                    style={{
                        fontFamily: 'ChakraPetch-Bold',
                        color: color.CREAM,
                    }}
                >
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default MyButtonText;
