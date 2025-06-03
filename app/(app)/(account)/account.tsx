import {useEffect} from 'react';

import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Button, Card, H6, H4, Paragraph, XStack, YStack,} from 'tamagui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AnimatedTabsLayout, {TabItem} from "@/components/AnimatedTabsLayout";
import {useRouter} from "expo-router";
import accountAPI from "@/api/account";
import {useQuery} from "@tanstack/react-query";
import {showMessage} from "react-native-flash-message";
import {View, TouchableOpacity } from "react-native";
import {_AccountType} from "@/lib/@type";

const tabs: TabItem[] = [
    {
        label: 'Mở',
        value: 'open',
        content: <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center"
                         gap="$4">
            <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch mở</Paragraph>
            <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên
                thế giới</Paragraph>
        </YStack>,
    },
    {
        label: 'Đang chờ',
        value: 'waiting',
        content: <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center"
                         gap="$4">
            <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch mở</Paragraph>
            <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên
                thế giới</Paragraph>
        </YStack>,
    },
    {
        label: 'Đã đóng',
        value: 'closed',
        content: <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center"
                         gap="$4">
            <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch mở</Paragraph>
            <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên
                thế giới</Paragraph>
        </YStack>,
    },
]
export default function AccountScreen() {
    const router = useRouter();
    // Kiểm tra xem có tài khoản nào đang hoạt động hay không
    const {data, isSuccess, isError, isLoading} = useQuery({
        queryKey: ['accountAPI-accountActive'],
        queryFn: accountAPI.accountActive,
    });
    useEffect(() => {
        if (isError) {
            showMessage({
                message: 'Không thể lấy thông tin tài khoản hoạt động',
                description: 'Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.',
                type: 'danger',
                duration: 3000,
            })
        }
    }, [isError]);

    const activeAccount = data?.data || null;

    return (
        <LayoutScrollApp title="Tài khoản">
            <Card elevate size="$4" bordered backgroundColor="white" marginBottom={15}>
                <Card.Header padded>
                    {isLoading && <Paragraph theme="alt2">Đang tải...</Paragraph>}
                    {isSuccess && activeAccount && (
                        <>
                            <XStack alignItems="flex-start" justifyContent="space-between" paddingBottom={36}>
                                <YStack gap="$2">
                                    {/*name + btn list*/}
                                    <H6 fontWeight="bold">{activeAccount.name}</H6>
                                    {/*Credit + type name + code*/}
                                    <XStack gap="$2" alignItems="center">
                                        <View
                                            style={{
                                                paddingHorizontal: 8,
                                                borderRadius: 8,
                                                backgroundColor: activeAccount.type === _AccountType.TEST_ACCOUNT ? '#FEF08A' : '#BBF7D0',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Paragraph theme="alt2"
                                                       fontSize="$2">{activeAccount.type === _AccountType.TEST_ACCOUNT ? 'Credit' : 'Thật'}</Paragraph>
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
                                                       fontSize="$2">{activeAccount.account_type.name}</Paragraph>
                                        </View>
                                        <Paragraph theme="alt2" fontSize="$2">{activeAccount.code}</Paragraph>
                                    </XStack>
                                </YStack>
                                <TouchableOpacity
                                    onPress={() => {
                                        router.push('/(app)/(account)/list');
                                    }}
                                >
                                    <FontAwesome6 name="list" size={18} color="black" />
                                </TouchableOpacity>
                            </XStack>
                            <H4 fontWeight="bold">{Number(activeAccount.money).toLocaleString('en-US')} {activeAccount.currency.currency}</H4>
                        </>
                    )}
                    {isSuccess && !activeAccount && (
                        <>
                            <H6 fontWeight="bold" paddingBottom={12}>Không có tài khoản nào đang hoạt động</H6>
                            <Paragraph theme="alt2">Mở tài khoản mới hoặc restore 1 tài khoản</Paragraph>
                        </>
                    )}
                    {isError && (
                        <>
                            <H6 fontWeight="bold" paddingBottom={12}>Lỗi khi lấy thông tin tài khoản</H6>
                            <Paragraph theme="alt2">Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.</Paragraph>
                        </>
                    )}
                </Card.Header>
                <Card.Footer alignItems="center" justifyContent="center" gap="$4" padded>
                    {!isLoading &&
                        <>
                            {!activeAccount
                              &&
                                <>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <Button
                                            borderRadius="100%"
                                            icon={<FontAwesome6 name="add" size={10} color="black"/>}
                                            onPress={() => {
                                                router.push('(app)/(account)/addStepOne');
                                            }}
                                        />
                                        <Paragraph theme="alt2" fontSize="$2">Tạo tài khoản</Paragraph>
                                    </YStack>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <Button borderRadius="100%"
                                                icon={<FontAwesome6 name="box-archive" size={10} color="black"/>}/>
                                        <Paragraph theme="alt2" fontSize="$2">Restore</Paragraph>
                                    </YStack>
                                </>
                            }
                            {activeAccount
                                &&
                                <>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <Button
                                            borderRadius="100%"
                                            theme="yellow"
                                            borderWidth={2}
                                            borderColor="$yellow6"
                                            paddingVertical={10}
                                            paddingHorizontal={12}
                                            icon={<FontAwesome6 name="circle-down" size={18} color="black" />}
                                            onPress={() => {
                                                router.push({
                                                    pathname: '/(account)/recharge/credit',
                                                    params: {
                                                        account_id: activeAccount.id,
                                                        currency: activeAccount.currency.currency,
                                                    }
                                                });
                                            }}
                                        />
                                        <Paragraph theme="alt2" fontSize="$2">Nạp tiền</Paragraph>
                                    </YStack>
                                    <YStack alignItems="center" justifyContent="center" gap="$2">
                                        <Button
                                            borderRadius="100%"
                                            paddingVertical={10}
                                            paddingHorizontal={12}
                                            icon={<FontAwesome6 name="circle-up" size={18} color="black" />}
                                        />
                                        <Paragraph theme="alt2" fontSize="$2">Rút tiền</Paragraph>
                                    </YStack>
                                </>
                            }
                        </>
                    }
                </Card.Footer>
            </Card>
            <AnimatedTabsLayout tabs={tabs} initialTab="open"/>
        </LayoutScrollApp>
    );
}


