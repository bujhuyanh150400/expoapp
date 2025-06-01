import LayoutScrollApp from "@/components/LayoutScrollApp";
import {useQuery} from "@tanstack/react-query";
import accountAPI from "@/api/account";
import {Button, Card, Paragraph, XStack, YStack,} from 'tamagui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {useRouter} from "expo-router";
import {View} from "react-native";
import {_AccountType} from "@/lib/@type";


export default function ListScreen() {
    const router = useRouter();

    const {data, isSuccess, isError, isLoading} = useQuery({
        queryKey: ['accountAPI-accountList'],
        queryFn: accountAPI.accountList,
    });

    const listAccount = data?.data || [];

    return (
        <LayoutScrollApp title="Danh sách tài khoản">
            <XStack gap="$2" padding="$2">
                <Button
                    icon={<FontAwesome6 name="add" size={10} color="black"/>}
                    onPress={() => {
                        router.push('/(app)/(account)/addStepOne');
                    }}
                >Tạo tài khoản</Button>
            </XStack>
            <YStack gap="$2" padding="$2">
                {isLoading && <Paragraph>Đang tải...</Paragraph>}
                {isError && <Paragraph>Lỗi khi tải danh sách tài khoản</Paragraph>}
                {isSuccess && listAccount.length === 0 && <Paragraph>Không có tài khoản nào</Paragraph>}
                {isSuccess && listAccount.length > 0 && listAccount.map((account, _key) => (
                    <Card
                        bordered
                        elevate
                        animation="bouncy"
                        hoverStyle={{ scale: 0.925 }}
                        pressStyle={{ scale: 0.875 }}
                        key={_key}
                        padding="$4"
                    >
                        <YStack gap="$2">
                            <Paragraph fontWeight="bold">{account.name}</Paragraph>
                            <XStack gap="$2" alignItems="center">
                                <View
                                    style={{
                                        paddingHorizontal: 8,
                                        borderRadius: 8,
                                        backgroundColor: account.type === _AccountType.TEST_ACCOUNT ? '#FEF08A' : '#BBF7D0',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Paragraph theme="alt2"
                                               fontSize="$2">{account.type === _AccountType.TEST_ACCOUNT ? 'Credit' : 'Thật'}</Paragraph>
                                </View>
                                <View
                                    style={{
                                        paddingHorizontal: 8,
                                        borderRadius: 8,
                                        backgroundColor: '#E5E5E5',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Paragraph theme="alt2"
                                               fontSize="$2">{account.account_type.name}</Paragraph>
                                </View>
                                <Paragraph theme="alt2" fontSize="$2">{account.code}</Paragraph>
                            </XStack>
                            <Paragraph theme="alt2">Số dư: {account.money} {account.currency.currency}</Paragraph>
                            <Paragraph theme="alt2">Trạng thái: {account.status ? 'Hoạt động' : 'Không hoạt động'}</Paragraph>
                        </YStack>
                    </Card>
                ))}
            </YStack>
        </LayoutScrollApp>
    )
}