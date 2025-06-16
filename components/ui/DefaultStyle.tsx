import {StyleSheet} from "react-native";

const DefaultStyle = StyleSheet.create({
    circleButton: {
        width: 45,
        height: 45,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    badge: {
        paddingHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default DefaultStyle;
