import { useRef } from "react";
import WebView from "react-native-webview";
import {BACKEND_REACT_URL} from "@/lib/constant";

export default function Test () {
    const webViewRef = useRef(null);
    const symbol = 'BTC/USD';
    const interval = '1min';
    const user_id = '10';
    const secret = '123';
    const url = `${BACKEND_REACT_URL}?symbol=${encodeURIComponent(symbol)}&interval=${interval}&user_id=${user_id}&secret=${secret}`;

    return (
        <WebView
            source={{ uri: url }}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            style={{ flex: 1 }}
        />
    );
}