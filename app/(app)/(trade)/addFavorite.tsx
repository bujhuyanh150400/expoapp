import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import React, {useEffect} from "react";
import {SearchSymbolList} from "@/app/(app)/(trade)/search";
import {useMutation} from "@tanstack/react-query";
import {AddFavoriteSymbolsRequest} from "@/api/asset_trading/type";
import assetTradingAPI from "@/api/asset_trading";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import {router} from "expo-router";
import useAppStore from "@/lib/store/appStore";


export default function AddFavoriteScreen () {

    const {mutate, isPending} = useMutation({
        mutationFn: (data: AddFavoriteSymbolsRequest) => assetTradingAPI.addFavoriteSymbolsRequest(data),
        onSuccess: async () => {
            router.replace("/(app)/(trade)/editFavorite")
        },
        onError: (error) => {
            useShowErrorHandler(error);
        }
    })

    const setLoading = useAppStore(state => state.setLoading);

    useEffect(() => {
        setLoading(isPending);
    }, [isPending]);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SearchSymbolList onPressItem={(item) => {
                    mutate({asset_trading_id: item.id})
                }}/>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}