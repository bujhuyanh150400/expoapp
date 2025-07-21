import LayoutScrollApp from "@/components/LayoutScrollApp";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useVerifyAccountUserStore, {
  FormVerifyAccountStepOne,
} from "@/lib/store/verifyAccountUserStore";
import { useRouter } from "expo-router";
import { Button, Form, Input, Label, Paragraph, YStack } from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import SelectFields from "@/components/SelectFields";
import useHideTabLayout from "@/lib/hooks/useHideTabLayout";
import { useQuery } from "@tanstack/react-query";
import commonAPI from "@/api/common";
import DefaultColor from "@/components/ui/DefaultColor";

const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

export default function StepOneScreen() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Ẩn tab layout
  useHideTabLayout();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormVerifyAccountStepOne>({
    resolver: yupResolver(
      yup.object({
        first_name: yup
          .string()
          .required("Họ là bắt buộc.")
          .max(255, "Họ không được vượt quá 255 ký tự."),
        last_name: yup
          .string()
          .required("Tên là bắt buộc.")
          .max(255, "Tên không được vượt quá 255 ký tự."),
        dob: yup
          .string()
          .required("Ngày sinh là bắt buộc.")
          .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            "Ngày sinh phải có định dạng YYYY-MM-DD"
          ),
        gender: yup
          .mixed<"male" | "female" | "other">()
          .oneOf(["male", "female", "other"], "Giới tính không hợp lệ")
          .required("Giới tính là bắt buộc."),
        phone_number: yup
          .string()
          .required("Số điện thoại là bắt buộc.")
          .max(20, "Số điện thoại không được vượt quá 20 ký tự."),
        bin_bank: yup.string().required("Vui lòng chọn ngân hàng"),
        account_bank: yup.string().required("Số tài khoản không được để trống"),
        account_bank_name: yup
          .string()
          .required("Tên chủ tài khoản không được để trống"),
        address: yup
          .string()
          .required("Địa chỉ là bắt buộc.")
          .max(500, "Địa chỉ không được vượt quá 500 ký tự."),
      })
    ),
  });

  const listBankQuery = useQuery({
    queryKey: ["commonAPI-listBank"],
    queryFn: commonAPI.listBank,
  });

  const listBankOptions = useMemo(() => {
    return (
      listBankQuery.data?.data.map((bank) => ({
        label: `${bank.code} - ${bank.short_name}`,
        value: bank.bin,
      })) || []
    );
  }, [listBankQuery.data]);

  const { setStepOne } = useVerifyAccountUserStore();

  const onSubmit = (data: FormVerifyAccountStepOne) => {
    setStepOne(data);
    router.push("/(app)/(info)/verify_user/stepTwo");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LayoutScrollApp
        style={{
          backgroundColor: "#fff",
        }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Form gap="$4" paddingBottom="$8" onSubmit={handleSubmit(onSubmit)}>
            <Paragraph theme="alt2" fontSize={20} fontWeight="bold">
              Vui lòng điền thông tin xác thực
            </Paragraph>

            {/* first_name */}
            <Controller
              control={control}
              name="first_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Họ
                  </Label>
                  <Input
                    id="first_name"
                    placeholder="Họ"
                    value={value ?? ""}
                    onChangeText={onChange}
                    backgroundColor="#fff"
                    onBlur={onBlur}
                    keyboardType="default"
                    autoCapitalize="none"
                    borderColor={!!errors.first_name ? "red" : "$borderColor"}
                  />
                  {!!errors.first_name && (
                    <Label color="red" size="$2">
                      {errors.first_name.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* last_name */}
            <Controller
              control={control}
              name="last_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Tên
                  </Label>
                  <Input
                    id="last_name"
                    placeholder="Tên"
                    value={value ?? ""}
                    onChangeText={onChange}
                    backgroundColor="#fff"
                    onBlur={onBlur}
                    keyboardType="default"
                    autoCapitalize="none"
                    borderColor={!!errors.last_name ? "red" : "$borderColor"}
                  />
                  {!!errors.last_name && (
                    <Label color="red" size="$2">
                      {errors.last_name.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* gender */}
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Giới tính
                  </Label>
                  <SelectFields
                    backgroundColor="#fff"
                    options={[
                      { label: "Nam", value: "male" },
                      { label: "Nữ", value: "female" },
                      { label: "Khác", value: "other" },
                    ]}
                    borderColor={!!errors.gender ? "red" : "$borderColor"}
                    value={`${value}`}
                    onValueChange={onChange}
                    placeholder="Chọn giới tính"
                  />
                  {!!errors.gender && (
                    <Label color="red" size="$2">
                      {errors.gender.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* phone_number */}
            <Controller
              control={control}
              name="phone_number"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone_number"
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    maxLength={15}
                    value={value ?? ""}
                    onChangeText={onChange}
                    backgroundColor="#fff"
                    onBlur={onBlur}
                    autoCapitalize="none"
                    borderColor={!!errors.phone_number ? "red" : "$borderColor"}
                  />
                  {!!errors.phone_number && (
                    <Label color="red" size="$2">
                      {errors.phone_number.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* address */}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Địa chỉ
                  </Label>
                  <Input
                    id="address"
                    placeholder="Địa chỉ"
                    value={value ?? ""}
                    onChangeText={onChange}
                    backgroundColor="#fff"
                    onBlur={onBlur}
                    keyboardType="default"
                    autoCapitalize="none"
                    borderColor={!!errors.address ? "red" : "$borderColor"}
                  />
                  {!!errors.address && (
                    <Label color="red" size="$2">
                      {errors.address.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* bin bank */}
            <Controller
              control={control}
              name="bin_bank"
              render={({ field: { onChange, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Ngân hàng
                  </Label>
                  <SelectFields
                    backgroundColor="#fff"
                    options={listBankOptions}
                    borderColor={!!errors.bin_bank ? "red" : "$borderColor"}
                    value={`${value}`}
                    onValueChange={onChange}
                    placeholder="Chọn ngân hàng"
                  />
                  {!!errors.bin_bank && (
                    <Label color="red" size="$2">
                      {errors.bin_bank.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* account_bank */}
            <Controller
              control={control}
              name="account_bank"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Tài khoản ngân hàng
                  </Label>
                  <Input
                    id="account_bank"
                    placeholder="Tài khoản ngân hàng"
                    value={value ?? ""}
                    onChangeText={onChange}
                    backgroundColor="#fff"
                    onBlur={onBlur}
                    keyboardType="default"
                    autoCapitalize="none"
                    borderColor={!!errors.account_bank ? "red" : "$borderColor"}
                  />
                  {!!errors.account_bank && (
                    <Label color="red" size="$2">
                      {errors.account_bank.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* account_bank_name */}
            <Controller
              control={control}
              name="account_bank_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Tên tài khoản ngân hàng
                  </Label>
                  <Input
                    id="account_bank_name"
                    placeholder="Tên tài khoản ngân hàng"
                    value={value ?? ""}
                    onChangeText={(text) => {
                      const formatted = removeVietnameseTones(text);
                      onChange(formatted);
                    }}
                    backgroundColor="#fff"
                    onBlur={onBlur}
                    keyboardType="default"
                    autoCapitalize="characters"
                    borderColor={
                      !!errors.account_bank_name ? "red" : "$borderColor"
                    }
                  />
                  {!!errors.account_bank_name && (
                    <Label color="red" size="$2">
                      {errors.account_bank_name.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            {/* dob */}
            <Controller
              control={control}
              name="dob"
              defaultValue=""
              render={({ field: { onChange, value } }) => (
                <YStack gap="$2">
                  <Label fontWeight={500} size="$2">
                    Ngày sinh:{" "}
                    {/* {value
                      ? `${dayjs(value).format("DD/MM/YYYY")}`
                      : "Chọn ngày sinh"} */}
                  </Label>

                  <Pressable onPress={() => setShowDatePicker(true)}>
                    <Input
                      placeholder="Chọn ngày sinh"
                      value={
                        value && dayjs(value).isValid()
                          ? dayjs(value).format("DD/MM/YYYY")
                          : ""
                      }
                      backgroundColor="#fff"
                      editable={false} // Không cho nhập tay
                      pointerEvents="none" // Disable text input
                      borderColor={!!errors.dob ? "red" : undefined}
                    />
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      locale="vi-VN"
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      textColor="black"
                      maximumDate={new Date()} // Không cho chọn ngày trong tương lai
                      value={value ? new Date(value) : new Date()}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === "android") {
                          setShowDatePicker(false);
                        }

                        if (event.type === "set" && selectedDate) {
                          onChange(dayjs(selectedDate).format("YYYY-MM-DD"));
                        }

                        if (event.type === "dismissed") {
                          setShowDatePicker(false);
                        }
                      }}
                    />
                  )}
                  {!!errors.dob && (
                    <Label color="red" size="$2">
                      {errors.dob.message}
                    </Label>
                  )}
                </YStack>
              )}
            />

            <YStack marginTop="$4" paddingBottom="$4">
              <Button
                theme="yellow"
                fontWeight={500}
                onPress={handleSubmit(onSubmit)}
              >
                Bước tiếp theo
              </Button>
            </YStack>
          </Form>
        </TouchableWithoutFeedback>
      </LayoutScrollApp>
    </KeyboardAvoidingView>
  );
}
