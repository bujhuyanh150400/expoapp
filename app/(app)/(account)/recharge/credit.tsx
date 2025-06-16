import LayoutScrollApp from "@/components/LayoutScrollApp";
import {useMutation, useQuery} from "@tanstack/react-query";
import accountAPI from "@/api/account";
import {Button, Paragraph, XStack, YStack, Form, Label, Spinner,} from 'tamagui';
import {useLocalSearchParams, useRouter} from "expo-router";
import React, {useCallback, useEffect} from "react";
import {showMessage} from "react-native-flash-message";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {RechargeAccountRequest} from "@/api/account/type";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import {
    View,
    Text,
    TextInput,
    Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback
} from 'react-native';
import useHideTabLayout from "@/lib/hooks/useHideTabLayout";

export default function RechargeCreditScreen() {
    // Ẩn tab layout
    useHideTabLayout();

    const router = useRouter();

    const {account_id, currency} = useLocalSearchParams<{ account_id?: string; currency?: string }>();

    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors}
    } = useForm<RechargeAccountRequest>({
        defaultValues: {
            account_id: Number(account_id) || 0,
        },
        resolver: yupResolver(
            yup.object({
                account_id: yup.number().required(),
                money: yup.number()
                    .required('Số tiền là bắt buộc')
                    .typeError('Số tiền là bắt buộc')
                    .min(1000, 'Số tiền nạp tối thiểu là 1')
                    .max(10000000000, 'Số tiền nạp tối đa là 10000000000')
            })
        ),

    })

    useEffect(() => {
        if (Number(account_id) > 0 && !isNaN(Number(account_id))) {
            setValue('account_id', Number(account_id));
        } else {
            showMessage({
                message: "Tài khoản không hợp lệ",
                type: "danger",
                duration: 3000,
            })
            router.replace("/(app)/(tab)");
        }
    }, [account_id]);

    const {mutate, isPending} = useMutation({
        mutationFn: (data: RechargeAccountRequest) => accountAPI.recharge(data),
        onSuccess: async () => {
            showMessage({
                message: "Nạp tiền thành công",
                type: 'success',
                duration: 3000,
            });
            router.replace("/(app)/(tab)");
        },
        onError: (error) => {
            useShowErrorHandler(error);
        }
    })


    const onSubmit = useCallback((data: RechargeAccountRequest) => {
        mutate(data)
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, backgroundColor: "#fff"}}
            keyboardVerticalOffset={60}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Form
                    gap="$4"
                    height="100%"
                    paddingHorizontal="$6"
                    paddingVertical="$4"
                    justifyContent="space-between"
                    onSubmit={handleSubmit(onSubmit)}>
                    <YStack gap="$3">
                        <Paragraph textAlign="center" fontWeight={500}>Nhập số tiền nạp</Paragraph>
                        <Controller
                            control={control}
                            name="money"
                            render={({field: {onChange, onBlur, value}}) => (
                                <View style={{
                                    flexDirection: 'column',
                                    borderBottomWidth: 1,
                                    paddingBottom: 2,
                                    borderBottomColor: '#ddd',
                                }}>
                                    <XStack gap={8} alignItems="center" >
                                        <TextInput
                                            style={{
                                                flex: 1,
                                                fontSize: 24,
                                                borderRightWidth: 1,
                                                borderRightColor: '#ddd',
                                            }}
                                            placeholder="Nhập số tiền nạp"
                                            value={`${value ?? ''}`}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="number-pad"
                                            maxLength={13}
                                        />
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            marginLeft: 8,
                                        }}>{currency ?? "USD"}</Text>
                                    </XStack>
                                    <Paragraph fontSize={12} color="#ccc">Max 10.000.000.000 {currency ?? "USD"}</Paragraph>
                                </View>
                            )}
                        />
                        {!!errors.money && (
                            <Label color="red" size="$2">
                                {errors.money.message}
                            </Label>
                        )}
                    </YStack>

                    {isPending ? <Spinner/> :
                        <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                                onPress={handleSubmit(onSubmit)}>
                            Tiếp tục
                        </Button>
                    }
                </Form>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
