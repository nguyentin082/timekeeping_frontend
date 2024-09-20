import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import color from '../../constants/color';
import { useLoadFonts } from '../hooks/useLoadFonts';
import { StatusBar } from 'expo-status-bar';

const { height, width } = Dimensions.get('window');

const Fail = () => {
    const fontsLoaded = useLoadFonts();

    // Avoid rendering camera hooks conditionally
    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.overlayContainer}>
            <StatusBar style="light" />
            <Text style={styles.failText}>FAIL !</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: color.RED_INACTIVE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1, // Ensure it is on top of other components
    },
    failText: {
        color: 'white',
        fontSize: 40,
        fontFamily: 'Roboto-Bold',
    },
});

export default Fail;
