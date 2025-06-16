import {useFocusEffect, useNavigation} from "expo-router";
import {useCallback} from "react";
import {appTabStyle} from "@/app/(app)/(tab)/_layout";

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
                parent.setOptions({ tabBarStyle: appTabStyle.tabBarStyle });
            };
        }, [navigation])
    );
}