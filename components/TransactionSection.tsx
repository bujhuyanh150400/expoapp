import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Paragraph, XStack} from "tamagui";
import React, {FC} from "react";
import DefaultColor from "@/components/ui/DefaultColor";
import {Account} from "@/api/account/type";
import {useTransactionTotal} from "@/lib/hooks/useTransactionTotal";
import DefaultStyle from "@/components/ui/DefaultStyle";


type Props = {
    account: Account | null,
}

const TransactionSection:FC<Props> = (props) => {

    const {total} = useTransactionTotal(props.account?.id || null);

    return (
        <TouchableOpacity style={styles.open_close_container}>
            <XStack alignItems={"center"} gap={"$2"}>
                <Paragraph fontSize={12} fontWeight={(total?.open ?? 0) > 0 ? 700 : "normal"}>Mở</Paragraph>
                <View style={[
                    DefaultStyle.badgeCircle,
                    {backgroundColor: (total?.open ?? 0) > 0 ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                ]}>
                    <Paragraph>{total?.open ?? 0}</Paragraph>
                </View>
            </XStack>
            <XStack alignItems={"center"} gap={"$2"}>
                <Paragraph fontSize={12} fontWeight={(total?.waiting ?? 0) > 0 ? 700 : "normal"}>Chờ giao dịch</Paragraph>
                <View style={[
                    DefaultStyle.badgeCircle,
                    {backgroundColor: (total?.waiting ?? 0) > 0 ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                ]}>
                    <Paragraph>{total?.waiting ?? 0}</Paragraph>
                </View>
            </XStack>
            <XStack alignItems={"center"} gap={"$2"}>
                <Paragraph fontSize={12} fontWeight={(total?.close ?? 0) > 0 ? 700 : "normal"}>Đóng</Paragraph>
                <View style={[
                    DefaultStyle.badgeCircle,
                    {backgroundColor: (total?.close ?? 0) > 0 ? DefaultColor.slate[300] : DefaultColor.slate[200]}
                ]}>
                    <Paragraph>{total?.close ?? 0}</Paragraph>
                </View>
            </XStack>
        </TouchableOpacity>

    )
}

export default TransactionSection;

const styles = StyleSheet.create({
    open_close_container: {
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        gap: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: DefaultColor.slate[100],
    },
})
