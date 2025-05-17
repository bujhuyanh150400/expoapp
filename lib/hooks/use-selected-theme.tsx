import { colorScheme, useColorScheme } from 'nativewind';
import {SELECTED_THEME} from "@/lib/storage/key";
import {useCallback} from "react";
import type { Theme } from '@react-navigation/native';
import {
    DarkTheme as _DarkTheme,
    DefaultTheme,
} from '@react-navigation/native';

import colors from '@/components/ui/color';
import {useAsyncStorageString} from "@/lib/hooks/useAsyncStorageString";
import storage from "@/lib/storage";

export type ColorSchemeType = 'light' | 'dark' | 'system';

const DarkTheme: Theme = {
    ..._DarkTheme,
    colors: {
        ..._DarkTheme.colors,
        primary: colors.primary[200],
        background: colors.charcoal[950],
        text: colors.charcoal[100],
        border: colors.charcoal[500],
        card: colors.charcoal[850],
    },
};

const LightTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary[400],
        background: colors.white,
    },
};

export function useThemeConfig() {
    const { colorScheme } = useColorScheme();

    // if (colorScheme === 'dark') return DarkTheme;

    return LightTheme;
}


export const useSelectedTheme = () => {
    const { colorScheme: _color, setColorScheme } = useColorScheme();
    const [theme, _setTheme] = useAsyncStorageString(SELECTED_THEME, 'light');

    const setSelectedTheme = useCallback(
        (t: ColorSchemeType) => {
            setColorScheme(t);
            _setTheme(t);
        },
        [setColorScheme, _setTheme]
    );

    const selectedTheme = (theme ?? 'system') as ColorSchemeType;
    return { selectedTheme, setSelectedTheme } as const;
};

export const loadSelectedTheme = async () => {
    const theme = await storage.getItem<ColorSchemeType>(SELECTED_THEME);
    if (theme) {
        colorScheme.set(theme);
    }
};
