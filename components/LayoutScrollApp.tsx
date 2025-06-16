import {ReactNode, useRef, useState} from "react";
import {
    Animated,
    StyleSheet,
    Text,
    View,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import {FocusAwareStatusBar} from "@/components/FocusAwareStatusBar";
import {H3, H6, ViewStyle} from "tamagui";
import {StyleProp} from "@tamagui/web";

export default function LayoutScrollApp({children, title, style}: { children: ReactNode, title?: string, style?: StyleProp<ViewStyle> }) {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showHeader, setShowHeader] = useState<boolean>(false);
    // Dùng interpolate để tạo hiệu ứng fade
    const headerOpacity = scrollY.interpolate({
        inputRange: [20, 50], // Từ 0 đến 50px scroll
        outputRange: [0, 1], // Từ trong suốt đến hiện rõ
        extrapolate: 'clamp',
    });
    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const offsetY = event.nativeEvent.contentOffset.y;
                setShowHeader(offsetY > 40);
            },
        }
    );
    return (
        <View className="flex-1">
            <FocusAwareStatusBar hidden={showHeader}/>
            {/* Header fade in/out */}
            {title && <Animated.View style={[styles.stickyHeader, {opacity: headerOpacity}]}>
                <View style={styles.containerHeader}>
                    <Text style={styles.titleHeader}>{title}</Text>
                </View>
            </Animated.View>}

            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{padding: 20}}
                style={style as any}
            >
                {title && <H6 paddingVertical={12} fontWeight={700}>{title}</H6>}
                {children}
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F2F2F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        elevation: 3,
    },
    containerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        width: '100%',
        fontWeight: 'bold',
    },
    titleHeader: {
        fontSize: 16,
        fontWeight: '700',
    },
});