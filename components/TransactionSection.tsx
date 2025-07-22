import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Paragraph, XStack} from "tamagui";
import React, {FC} from "react";
import DefaultColor from "@/components/ui/DefaultColor";
import {Account} from "@/api/account/type";
import {useTransactionTotal} from "@/lib/hooks/useTransactionTotal";


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
                    styles.open_close_badge,
                    {backgroundColor: (total?.open ?? 0) > 0 ? DefaultColor.yellow[100] : DefaultColor.slate[300]}
                ]}>
                    <Paragraph>{total?.open ?? 0}</Paragraph>
                </View>
            </XStack>
            <XStack alignItems={"center"} gap={"$2"}>
                <Paragraph fontSize={12} fontWeight={(total?.waiting ?? 0) > 0 ? 700 : "normal"}>Chờ</Paragraph>
                <View style={[
                    styles.open_close_badge,
                    {backgroundColor: (total?.waiting ?? 0) > 0 ? DefaultColor.yellow[100] : DefaultColor.slate[300]}
                ]}>
                    <Paragraph>{total?.waiting ?? 0}</Paragraph>
                </View>
            </XStack>
            <XStack alignItems={"center"} gap={"$2"}>
                <Paragraph fontSize={12} fontWeight={(total?.close ?? 0) > 0 ? 700 : "normal"}>Đóng</Paragraph>
                <View style={[
                    styles.open_close_badge,
                    {backgroundColor: (total?.close ?? 0) > 0 ? DefaultColor.yellow[100] : DefaultColor.slate[300]}
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
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: DefaultColor.slate[200],
    },
    open_close_badge: {
        width: 24,
        height: 24,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: DefaultColor.slate[300],
    },
})
