import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export default function useAppInactive(onInactive: () => void, deps: any[] = []) {
    const appState = useRef(AppState.currentState);
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (
                appState.current === 'active' &&
                nextAppState === 'inactive'
            ) {
                onInactive();
            }
            appState.current = nextAppState;
        });
        return () => {
            subscription.remove();
        };
    }, [onInactive, ...deps]);
}
