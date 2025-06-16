import {Alert, StyleSheet, TouchableOpacity, View} from "react-native";
import useAuthStore from "@/lib/store/authStore";
import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Button, Paragraph, XStack, YStack, Separator, Spinner, H4} from "tamagui";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {_VerifyUserStatus} from "@/lib/@type";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useRouter} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import authAPI from "@/api/auth";

export default function InfoScreen() {
    const router = useRouter();

    const userProfileQuery = useQuery({
        queryKey: ['authAPI-userProfile'],
        queryFn: authAPI.userProfile
    })

    const userProfile = userProfileQuery?.data || null;

    const logout = useAuthStore((state) => state.logout);

    return (
        <LayoutScrollApp title="Hồ sơ">
            <YStack gap={4} marginTop={24}>
                <Paragraph fontWeight={700} fontSize={20} marginBottom={16}>Tài khoản</Paragraph>
                <TouchableOpacity
                    onPress={()=> router.push("/(app)/(info)/userInfo")}
                >
                    <XStack alignItems="center" justifyContent="space-between" gap="$4">
                        <XStack alignItems="center" gap="$4">
                            <View style={style.box_icon}>
                                <FontAwesome6 name="user" size={18} color="black"/>
                            </View>
                            <Paragraph fontWeight={500}>Thông tin cá nhân</Paragraph>
                        </XStack>
                        <XStack gap="$2" alignItems="center">
                            {userProfileQuery.isFetching && <Spinner />}
                            {userProfile &&
                                <View
                                    style={{
                                        paddingHorizontal: 8,
                                        borderRadius: 32,
                                        backgroundColor:
                                            userProfile.status === _VerifyUserStatus.ACTIVE
                                                ? "#EEFBF3"
                                                : (userProfile.status === _VerifyUserStatus.INACTVE ? "#FDF1EC" :
                                                        (userProfile.status === _VerifyUserStatus.WAITING ? "#FFFBED" : "#ccc")
                                                ),
                                    }}>
                                    {userProfile.status === _VerifyUserStatus.ACTIVE &&
                                        <Paragraph fontWeight={500} fontSize={12} color="427C5C">Đã xác minh</Paragraph>
                                    }
                                    {userProfile.status === _VerifyUserStatus.INACTVE &&
                                        <Paragraph fontWeight={500} fontSize={12} color="#814441">Chưa xác minh</Paragraph>
                                    }
                                    {userProfile.status === _VerifyUserStatus.WAITING &&
                                        <Paragraph fontWeight={500} fontSize={12}>Chờ xác minh</Paragraph>
                                    }
                                </View>
                            }
                            <FontAwesome6 name="angle-right" size={20} color="black"/>
                        </XStack>
                    </XStack>
                </TouchableOpacity>

                {userProfile?.status === _VerifyUserStatus.INACTVE &&
                    <View style={{
                        flex: 1,
                        padding: 16,
                        marginTop: 16,
                        backgroundColor: "#FFFBED",
                        borderRadius: 8,
                        flexDirection: "column",
                        gap: 32
                    }}>
                        <XStack gap="$2" alignItems="flex-start" flex={1}>
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 32,
                                    backgroundColor: '#fefae0', // màu nền kem
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {/* Vòng tròn ngoài */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        width: 50,
                                        height: 50,
                                        borderRadius: 32,
                                        borderWidth: 4,
                                        borderColor: '#d6ccc2', // màu vòng ngoài nhạt
                                        opacity: 0.4,
                                    }}
                                />

                                {/* Icon người */}
                                <FontAwesome6 name="user-xmark" size={16} color="black"/>
                            </View>
                            <Paragraph
                                fontSize={14}
                                fontWeight={500}
                                style={{
                                    flex: 1,
                                    flexWrap: 'wrap', // Nếu vẫn lỗi thì có thể bỏ, chỉ cần flex: 1 là đủ
                                }}
                            >
                                Xin chào! Hãy điền thông tin chi tiết tài khoản của bạn để có thể nạp tiền lần đầu
                            </Paragraph>
                        </XStack>
                        <Button theme="yellow" fontWeight={500} onPress={() => {
                            router.push('/(app)/(info)/verify_user/stepOne');
                        }}>Hoàn tất hồ sơ</Button>
                    </View>
                }
                <Paragraph fontWeight={700} fontSize={20} marginVertical={16}>Ví tiền</Paragraph>
                <TouchableOpacity>
                    <XStack alignItems="center" justifyContent="space-between" gap="$4">
                        <XStack alignItems="center" gap="$4">
                            <View style={style.box_icon}>
                                <Ionicons name="wallet-outline" size={18} color="black"/>
                            </View>
                            <Paragraph fontWeight={500}>Số dư</Paragraph>
                        </XStack>
                        <XStack gap="$2" alignItems="center">
                            {userProfileQuery.isFetching && <Spinner />}
                            {userProfile &&
                                <Paragraph fontWeight="bold">{Number(userProfile.money).toLocaleString('en-US')} VND</Paragraph>
                            }
                            <FontAwesome6 name="angle-right" size={20} color="black"/>
                        </XStack>
                    </XStack>
                </TouchableOpacity>

                <Separator marginVertical={24}/>
                <TouchableOpacity onPress={() => {
                    Alert.alert(
                        "Đăng xuất tài khoản",
                        "Bạn có chắc chắn muốn đăng xuất?",
                        [
                            {text: "Hủy", style: "cancel"},
                            {text: "Đăng xuất", style: "destructive", onPress: logout}
                        ]
                    )
                }}>
                    <XStack alignItems="center" justifyContent="space-between" gap="$4">
                        <XStack alignItems="center" gap="$4">
                            <View style={[
                                style.box_icon, {
                                    backgroundColor: "#FDF1EC"
                                }
                            ]}>
                                <Ionicons name="exit-outline" size={24} color="#814441"/>
                            </View>
                            <Paragraph fontWeight={500}>Đăng xuất</Paragraph>
                        </XStack>
                        <XStack gap="$2" alignItems="center">
                            <FontAwesome6 name="angle-right" size={20} color="black"/>
                        </XStack>
                    </XStack>
                </TouchableOpacity>
            </YStack>
        </LayoutScrollApp>
    );
}

const style = StyleSheet.create({
    box_icon: {
        width: 48,
        height: 48,
        backgroundColor: "#E5E5E5",
        borderRadius: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
})