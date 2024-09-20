import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import React from 'react';
import style from '../../constants/style';
import Brand from '../components/Brand';
import color from '../../constants/color';

const Splash = () => {
    return (
        <SafeAreaView style={style.background} className="flex-1 items-center">
            {/* <Brand /> */}
            <ActivityIndicator
                size="large"
                color={color.BLACK}
                className="flex-1"
            />
        </SafeAreaView>
    );
};

export default Splash;
