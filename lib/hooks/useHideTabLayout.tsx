import {useFocusEffect, useNavigation} from "expo-router";
import {useCallback} from "react";
import {styleLayout} from "@/app/(app)/_layout";


export default function useHideTabLayout() {
    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
            const parent = navigation.getParent?.();
            if (!parent) return;

            // Ẩn tab bar khi màn hình này được focus
            parent.setOptions({ tabBarStyle: { display: 'none' } });
            // Khôi phục style gốc khi unfocus
            return () => {
                parent.setOptions({ tabBarStyle: styleLayout.tabBarStyle });
            };
        }, [navigation])
    );
}