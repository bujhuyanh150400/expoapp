import {useLocalSearchParams} from "expo-router";


export default function TradingScreen(){
    const {symbol} = useLocalSearchParams<{ symbol?: string }>();


    return (
        <>
        </>
    )
}