import {Button, Form, Label, TextArea, YStack} from "tamagui";
import SelectFields from "@/components/SelectFields";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import formSupportStore, {FormSupportStepTwo} from "@/lib/store/formSupportStore";
import {_SupportTicketPriority} from "@/lib/@type";
import useAppStore from "@/lib/store/appStore";
import {Platform, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from "react-native";
import {useMutation} from "@tanstack/react-query";
import {showMessage} from "react-native-flash-message";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import ticketAPI from "@/api/ticket";
import {router} from "expo-router";
import {CreateTicketRequest} from "@/api/ticket/type";
import React, {useCallback} from "react";
import {FormAddAccountStepThree} from "@/lib/store/addAccountStore";
import DefaultColor from "@/components/ui/DefaultColor";


export default function stepTwoScreen(){

    const {
        control,
        handleSubmit,
        formState: {errors}
    } = useForm<FormSupportStepTwo>({
        resolver: yupResolver(
            yup.object({
                priority: yup.mixed<_SupportTicketPriority>().required("Độ ưu tiên là bắt buộc"),
                message: yup.string().trim('Phản hồi là bắt buộc').required('Phản hồi là bắt buộc').typeError('Phản hồi là bắt buộc'),
            })
        ),
    })
    const setLoading = useAppStore(state => state.setLoading);

    const {mutate, isPending} = useMutation({
        mutationFn: (data: CreateTicketRequest) => ticketAPI.create(data),
        onSuccess: async () => {
            setLoading(false)
            showMessage({
                message: "Gửi yêu cầu hỗ trợ thành công",
                description: "Chúng tôi sẽ phản hồi trong thời gian sớm nhất, cam ơn bạn đã quan tâm sử dụng dịch vụ của chúng tôi.",
                type: 'success',
                duration: 3000,
            });
            router.replace('/(app)/(tab)/info');
        },
        onError: (error) => {
            setLoading(false)
            useShowErrorHandler(error);
        },
        meta: {
            loadingMessage: "Đang gửi yêu cầu hỗ trợ...",
        }
    })
    const {form_step_1, clearStepOne} = formSupportStore()


    const onSubmit = useCallback((form: FormSupportStepTwo) => {
        if (form_step_1) {
            setLoading(true)
            mutate({...form_step_1,...form})
        }else{
            showMessage({
                message: "Có lỗi không mong muốn xảy ra, vui lòng thử lại sau.",
                type: 'warning',
                duration: 3000,
            });
        }
    }, [form_step_1]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1, backgroundColor: "#fff"}}
            keyboardVerticalOffset={24}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Form
                    gap="$4"
                    height="100%"
                    flex={1}
                    paddingHorizontal="$6"
                    paddingVertical="$4"
                    justifyContent="space-between"
                    onSubmit={handleSubmit(onSubmit)}>
                    <YStack gap="$4" flex={1}>
                        <Controller
                            control={control}
                            name="priority"
                            render={({field: {onChange, value}}) => (
                                <YStack gap="$2">
                                    <Label size="$2">
                                        Độ ưu tiên
                                    </Label>
                                    <SelectFields
                                        backgroundColor={DefaultColor.white}
                                        options={[
                                            {label: "Thấp", value: _SupportTicketPriority.LOW},
                                            {label: "Trung bình", value: _SupportTicketPriority.MEDIUM},
                                            {label: "Cao", value: _SupportTicketPriority.HIGH},
                                        ]}
                                        value={`${value}`}
                                        onValueChange={onChange}
                                        placeholder="Chọn độ ưu tiên"
                                    />
                                    {!!errors.priority && (
                                        <Label color="red" size="$2">
                                            {errors.priority.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />
                        <Controller
                            control={control}
                            name="message"
                            render={({field: {onChange, onBlur, value}}) => (
                                <YStack gap="$2" flex={1}>
                                    <Label size="$2">
                                        Phản hồi
                                    </Label>
                                    <YStack flex={1} backgroundColor={DefaultColor.white} borderRadius={8}>
                                        <TextArea
                                            flex={1}
                                            id="message"
                                            value={value ?? ''}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            placeholder="Bạn hãy nhập phản hồi của mình tại đây, chúng tôi sẽ cố gắng phản hồi bạn sớm nhất"
                                            keyboardType="default"
                                            autoCapitalize="none"
                                            multiline
                                            borderColor={!!errors.message ? 'red' : '$borderColor'}
                                            backgroundColor={DefaultColor.white}
                                            style={{
                                                textAlignVertical: 'top',
                                                padding: 10,
                                            }}
                                        />
                                    </YStack>

                                    {!!errors.message && (
                                        <Label color="red" size="$2">
                                            {errors.message.message}
                                        </Label>
                                    )}
                                </YStack>
                            )}
                        />
                    </YStack>
                    <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                            onPress={handleSubmit(onSubmit)}>
                        Gửi phản hồi
                    </Button>
                </Form>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}