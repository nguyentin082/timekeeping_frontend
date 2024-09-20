import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import color from './color';

type Style = {
    background: ViewStyle;
    check: ImageStyle;
};

export default StyleSheet.create<Style>({
    background: {
        backgroundColor: color.CREAM,
    },
    check: {
        borderWidth: 2,
        borderColor: 'red',
    },
});
