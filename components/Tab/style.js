import { StyleSheet } from "react-native";
import { verticalScale, horizontalScale, scaleFontSize } from "../../assets/styles/scaling";

const style = StyleSheet.create({
    tab: {
        backgroundColor: '#2979F2',
        height: verticalScale(50),
        justifyContent: 'center',
        borderRadius: horizontalScale(50),
    },
    inactiveTab: {
        backgroundColor: "#F3F5F9",
    },
    title: {
        fontFamily: 'Inter_18pt',
        fontSize: scaleFontSize(14),
        fontWeight: '500',
        lineHeight: scaleFontSize(17),
        color: '#FFFFFF',
        textAlign: 'center',
    },
    inactiveTitle: {
        color: "#79869F",
    },
});

export default style;