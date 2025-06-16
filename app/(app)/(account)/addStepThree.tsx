import {useQuery} from "@tanstack/react-query";
import FullScreenLoading from "@/components/FullScreenLoading";
import {
    Form,
    Input,
    Paragraph,
    YStack,
    Label,
    Button
} from "tamagui";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAddAccountStore, {FormAddAccountStepThree} from "@/lib/store/addAccountStore";
import {Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback} from "react-native";
import React, {useCallback, useMemo} from "react";
import SelectFields from "@/components/SelectFields";
import {useRouter} from "expo-router";
import commonAPI from "@/api/common";
import useHideTabLayout from "@/lib/hooks/useHideTabLayout";


export default function AddStepThreeScreen() {
    // Ẩn tab layout
    useHideTabLayout();

    const router = useRouter();
    // @ts-ignore
    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<FormAddAccountStepThree>({
        resolver: yupResolver(
            yup.object({
                name: yup.string().nullable().optional(),
                lever_id: yup.number().required('Tỷ lệ đòn bẩy là bắt buộc').typeError('Tỷ lệ đòn bẩy là bắt buộc'),
                currency_id: yup.number().required('Loại tiền tệ là bắt buộc').typeError('Loại tiền tệ là bắt buộc'),
            })
        ),
    })

    const {setStepThree} = useAddAccountStore();

    const currenciesQuery = useQuery({
        queryKey: ['commonAPI-currencies'],
        queryFn: commonAPI.currencies,
    });
    const leversQuery = useQuery({
        queryKey: ['commonAPI-levers'],
        queryFn: commonAPI.levers,
    });
    const onSubmit = useCallback((data: FormAddAccountStepThree) => {
        setStepThree(data);
        router.push('/(app)/(account)/addStepFour');
    }, []);

    const currenciesOptions = useMemo(() => {
        return currenciesQuery.data?.data.map(currency => ({
            label: currency.currency,
            value: currency.id.toString(),
        })) || [];
    }, [currenciesQuery.data]);

    const leversOptions = useMemo(() => {
        return leversQuery.data?.data.map(lever => ({
            label: `${lever.min} - ${lever.max}`,
            value: lever.id.toString(),
        })) || [];
    }, [leversQuery.data]);
    // @ts-ignore
    return (
        <>
            <FullScreenLoading loading={currenciesQuery.isLoading && leversQuery.isLoading}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1, backgroundColor: "#fff"}}
                keyboardVerticalOffset={24}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Form
                        gap="$4"
                        height="100%"
                        paddingHorizontal="$6"
                        paddingVertical="$4"
                        justifyContent="space-between"
                        onSubmit={handleSubmit(onSubmit)}>
                        <YStack gap="$4">
                            {/* Name */}
                            <Controller
                                control={control}
                                name="name"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label size="$2">
                                            Tên tài khoản
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Tên tài khoản"
                                            value={value ?? ""}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="default"
                                            autoCapitalize="none"
                                            borderColor={!!errors.name ? 'red' : '$borderColor'}
                                        />
                                        {!!errors.name && (
                                            <Label color="red" size="$2">
                                                {errors.name.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />
                            {/* currency_id */}
                            <Controller
                                control={control}
                                name="currency_id"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label size="$2">
                                            Chọn loại tiền tệ
                                        </Label>
                                        <SelectFields
                                            options={currenciesOptions}
                                            value={`${value}`}
                                            onValueChange={onChange}
                                            placeholder="Chọn loại tiền tệ"
                                        />
                                        {!!errors.currency_id && (
                                            <Label color="red" size="$2">
                                                {errors.currency_id.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />
                            {/* lever */}
                            <Controller
                                control={control}
                                name="lever_id"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <YStack gap="$2">
                                        <Label size="$2">
                                            Chọn tỷ lệ đòn bẩy
                                        </Label>
                                        <SelectFields
                                            options={leversOptions}
                                            value={`${value}`}
                                            onValueChange={onChange}
                                            placeholder="Chọn tỷ lệ đòn bẩy"
                                        />
                                        {!!errors.lever_id && (
                                            <Label color="red" size="$2">
                                                {errors.lever_id.message}
                                            </Label>
                                        )}
                                    </YStack>
                                )}
                            />
                            <Paragraph theme="alt2" color="#7a7f83">
                                Sử dụng đòn bẩy có nghĩa là bạn có thể giao dịch với số lượng lệnh giao dịch lớn hơn số
                                tiền trong tài khoản giao dịch của mình giá trị đòn bẩy được thể hiện dưới dạng tỉ lệ
                            </Paragraph>
                        </YStack>
                        <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                                onPress={handleSubmit(onSubmit)}>
                            Tiếp tục
                        </Button>
                    </Form>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    )
}
