import {View, Dimensions} from "react-native";
import { useRouter} from "expo-router";
import FullScreenLoading from "@/components/FullScreenLoading";
import {useQuery} from "@tanstack/react-query";
import accountAPI from "@/api/account";
import {useState, useRef, useEffect} from "react";
import {AccountType} from "@/api/account/type";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";
import {
    useSharedValue,
} from "react-native-reanimated";

const {width} = Dimensions.get('window');
import {Button, Card, H2,  Paragraph, Separator, XStack,  YStack} from 'tamagui'
import AntDesign from '@expo/vector-icons/AntDesign';
import useAddAccountStore from "@/lib/store/addAccountStore";

export default function AddStepTwo() {
    const router = useRouter();
    const [selectedAccountId, setSelectedAccountTypeId] = useState<number | null>(null);

    const progress = useSharedValue<number>(0);
    const ref = useRef<ICarouselInstance>(null);

    const {data, isLoading} = useQuery({
        queryKey: ['accountAPI-accountTypeList'],
        queryFn: accountAPI.accountTypeList,
    });

    const accountTypes: AccountType[] = data?.data ?? [];

    useEffect(() => {
        if (accountTypes.length > 0){
            setSelectedAccountTypeId(accountTypes[0].id)
        }
    }, [accountTypes]);

    const {setStepTwo} = useAddAccountStore();

    return (
        <>
            <FullScreenLoading loading={isLoading}/>
            <YStack flex={1} gap="$2" padding={16}>
                <Carousel
                    width={width - 32}
                    height={420}
                    data={accountTypes}
                    scrollAnimationDuration={200}
                    onSnapToItem={(index: number) => {
                        const current = accountTypes[index];
                        if (current) {
                            setSelectedAccountTypeId(current.id);
                        }
                    }}
                    onProgressChange={progress}
                    renderItem={({item}) => (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width * 0.9,
                                alignSelf: 'center',
                                paddingVertical: 16,
                            }}
                        >
                            <Card
                                bordered
                                backgroundColor="white"
                                style={{
                                    width: '100%',
                                    borderRadius: 16,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 2},
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 3,
                                }}
                            >
                                <Card.Header padded alignItems="center">
                                    <H2 fontWeight={700} marginBottom="$2" textAlign="center">
                                        {item.name}
                                    </H2>
                                    <View
                                        style={{
                                            paddingHorizontal: 12,
                                            paddingVertical: 4,
                                            borderRadius: 999,
                                            backgroundColor: '#FEF08A',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            marginTop: 8,
                                        }}
                                    >
                                        <AntDesign name="checkcircleo" size={20} color="black"/>
                                        <Paragraph theme="alt2">{item.summary}</Paragraph>
                                    </View>
                                </Card.Header>
                                <Card.Footer padded>
                                    <YStack gap="$2">
                                        <Paragraph
                                            theme="alt2"
                                            textAlign="center"
                                            style={{marginBottom: 12}}
                                        >
                                            {item.description}
                                        </Paragraph>
                                        <Separator marginVertical={8} />
                                        <XStack justifyContent="space-between" width="100%">
                                            <Paragraph color="#7a7f83" fontWeight={500}>Tiền nạp tối thiểu:</Paragraph>
                                            <Paragraph fontWeight={500}>{item.min} USD</Paragraph>
                                        </XStack>
                                        <Separator marginVertical={8} />
                                        <XStack justifyContent="space-between" width="100%">
                                            <Paragraph color="#7a7f83" fontWeight={500}>Chênh lệch:</Paragraph>
                                            <Paragraph fontWeight={500}>Từ {item.difference}</Paragraph>
                                        </XStack>
                                        <Separator marginVertical={8} />
                                        <XStack justifyContent="space-between" width="100%">
                                            <Paragraph color="#7a7f83" fontWeight={500}>Hoa hồng:</Paragraph>
                                            <Paragraph fontWeight={500}>{item.commission}</Paragraph>
                                        </XStack>
                                    </YStack>
                                </Card.Footer>
                            </Card>
                        </View>
                    )}
                />
                <Pagination.Basic
                    progress={progress}
                    data={accountTypes}
                    size={10}
                    dotStyle={{
                        borderRadius: 100,
                        backgroundColor: "#ccc",
                    }}
                    activeDotStyle={{
                        borderRadius: 100,
                        overflow: "hidden",
                        backgroundColor: "#000",
                    }}
                    containerStyle={[
                        {
                            gap: 5,
                            marginBottom: 10,
                        },
                    ]}
                    horizontal
                    onPress={(index: number) => {
                        ref.current?.scrollTo({
                            count: index - Math.round(progress.value),
                            animated: true,
                        })
                    }}
                />
                <Button theme="yellow" fontWeight="bold" borderWidth={1} borderColor="$yellow10"
                        onPress={() => {
                            if (selectedAccountId) {
                                setStepTwo({account_type_id: selectedAccountId });
                                router.push('/(account)/addStepThree');
                            }
                        }}
                >
                    Tiếp tục
                </Button>
            </YStack>
        </>
    );
}