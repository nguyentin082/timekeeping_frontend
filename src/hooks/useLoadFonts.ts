import { useFonts } from 'expo-font';

export const useLoadFonts = () => {
    const [fontsLoaded] = useFonts({
        // Roboto Fonts
        'Roboto-Black': require('../../assets/fonts/Roboto-Black.ttf'),
        'Roboto-BlackItalic': require('../../assets/fonts/Roboto-BlackItalic.ttf'),
        'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
        'Roboto-BoldItalic': require('../../assets/fonts/Roboto-BoldItalic.ttf'),
        'Roboto-Italic': require('../../assets/fonts/Roboto-Italic.ttf'),
        'Roboto-Light': require('../../assets/fonts/Roboto-Light.ttf'),
        'Roboto-LightItalic': require('../../assets/fonts/Roboto-LightItalic.ttf'),
        'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-MediumItalic': require('../../assets/fonts/Roboto-MediumItalic.ttf'),
        'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Thin': require('../../assets/fonts/Roboto-Thin.ttf'),
        'Roboto-ThinItalic': require('../../assets/fonts/Roboto-ThinItalic.ttf'),

        // Chakra Petch Fonts
        'ChakraPetch-Bold': require('../../assets/fonts/ChakraPetch-Bold.ttf'),
        'ChakraPetch-BoldItalic': require('../../assets/fonts/ChakraPetch-BoldItalic.ttf'),
        'ChakraPetch-Italic': require('../../assets/fonts/ChakraPetch-Italic.ttf'),
        'ChakraPetch-Light': require('../../assets/fonts/ChakraPetch-Light.ttf'),
        'ChakraPetch-LightItalic': require('../../assets/fonts/ChakraPetch-LightItalic.ttf'),
        'ChakraPetch-Medium': require('../../assets/fonts/ChakraPetch-Medium.ttf'),
        'ChakraPetch-MediumItalic': require('../../assets/fonts/ChakraPetch-MediumItalic.ttf'),
        'ChakraPetch-Regular': require('../../assets/fonts/ChakraPetch-Regular.ttf'),
        'ChakraPetch-SemiBold': require('../../assets/fonts/ChakraPetch-SemiBold.ttf'),
        'ChakraPetch-SemiBoldItalic': require('../../assets/fonts/ChakraPetch-SemiBoldItalic.ttf'),
    });

    return fontsLoaded;
};
