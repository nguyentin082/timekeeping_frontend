import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import color from '../../constants/color';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';

const MyButtonIcon = ({ iconName, handlePress, isDisable }: any) => {
    return (
        <View className="w-screen">
            <TouchableOpacity
                disabled={isDisable}
                className=" mx-10 rounded-2xl items-center py-4"
                style={{
                    backgroundColor: isDisable
                        ? color.GRAY_DISABLED_BACKGROUND
                        : color.SAGE_GREEN, // Change background color based on isDisable
                }}
                onPress={handlePress}
            >
                <FontAwesome
                    name={iconName}
                    size={28}
                    color={isDisable ? color.GRAY_DISABLED_ICON : color.CREAM}
                />
            </TouchableOpacity>
        </View>
    );
};

export default MyButtonIcon;
