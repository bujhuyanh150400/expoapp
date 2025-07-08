import {useLocalSearchParams} from "expo-router";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {ReplyTicketRequest, Ticket, TicketThreadRequest} from "@/api/ticket/type";
import ticketAPI from "@/api/ticket";
import useNestedState from "@/lib/hooks/useNestedState";
import {useEffect, useState} from "react";
import {ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View} from "react-native";
import {_SupportTicketSenderType, _SupportTicketStatus} from "@/lib/@type";
import {Button, Paragraph, XStack} from "tamagui";
import {RefreshControl} from "react-native-gesture-handler";
import useAppStore from "@/lib/store/appStore";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {FontAwesome} from '@expo/vector-icons';
import DefaultColor from "@/components/ui/DefaultColor";
import {useShowErrorHandler} from "@/lib/hooks/useApiErrorHandler";
import {formatMessageTime} from "@/lib/utils";

const useInfiniteTicketThreadQuery = (
    queryParams: TicketThreadRequest,
    enabled: boolean // thêm param này
) => {
    return useInfiniteQuery({
        queryKey: ['ticketAPI-getTicketThread', queryParams],
        queryFn: ({ pageParam = 1 }) => {
            return ticketAPI.getTicketThread({
                ...queryParams,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.current_page + 1;
            return next <= lastPage.meta.last_page ? next : undefined;
        },
        initialPageParam: 1,
        enabled, // 👉
    });
};


export default function ReplyScreen () {
    const {ticket_id} = useLocalSearchParams<{ ticket_id?: string }>();
    const [isValidId,setIsValidId] = useState<boolean>(false)
    const [filter,setFilter] = useNestedState<TicketThreadRequest>({
        ticket_id: 0,
        page: 1,
    })
    useEffect(() => {
        const numericTicketId = Number(ticket_id);
        const isValidTicketId = !isNaN(numericTicketId) && Number.isInteger(numericTicketId) && numericTicketId > 0;
        setIsValidId(isValidTicketId);
        if (isValidTicketId){
            setFilter({ticket_id: numericTicketId});
        }else{
            setFilter({ticket_id: 0});
        }
    },[ticket_id]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
        refetch,
        isRefetching,
    } = useInfiniteTicketThreadQuery(filter,isValidId);

    const flatData = data?.pages.flatMap((page) => page.data) || [];
    const setLoading = useAppStore(state => state.setLoading);

    const {mutate, isPending} = useMutation({
        mutationFn: (data: ReplyTicketRequest) => ticketAPI.reply(data),
        onSuccess: async () => {
            refetch();
        },
        onError: (error) => {
            console.log(error)
            useShowErrorHandler(error);
        }
    })

    useEffect(() => {
        setLoading(isLoading || isFetching || isPending)
    }, [isLoading, isFetching, isPending]);


    return (
        <View style={{flex: 1}}>
            <FlatList
                style={{flex: 1}}
                data={flatData}
                inverted
                keyExtractor={(item) => String(item.id)}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                    if (!isFetchingNextPage) return null;
                    return <ActivityIndicator style={{marginVertical: 10}}/>;
                }}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>
                }
                renderItem={({item}) => (
                    <MessageBubble {...item}/>
                )}
                contentContainerStyle={{ paddingBottom: 120 }} // để chừa chỗ cho ô input
            />
            {flatData && flatData[0]?.status === _SupportTicketStatus.OPEN &&
                <ChatInput onSend={(message) => {
                    mutate({
                        id: filter.ticket_id,
                        message
                    })
                }} />
            }
        </View>
    )
}
export function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
    const [message, setMessage] = useState('');
    const handleSend = () => {
        if (message.trim() !== '') {
            onSend(message.trim());
            setMessage('');
        }
    };
    const insets = useSafeAreaInsets();
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <XStack
                paddingBottom={insets.bottom + 10}
                marginTop={"$4"}
                paddingHorizontal={"$4"}
                paddingTop={10}
                borderTopWidth={1}
                borderColor="#ccc"
                alignItems="center"
                gap="$4"
            >
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Nhập tin nhắn..."
                    style={{
                        flex: 1,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        backgroundColor: '#f2f2f2',
                        borderRadius: 20,
                    }}
                />
                <Button disabled={message.trim() === ''} onPress={handleSend} borderRadius={100}  icon={<FontAwesome name="send-o" size={16} color="black" />}/>
            </XStack>
        </KeyboardAvoidingView>
    );
}

const MessageBubble = (props: Ticket) => {
    const isUser = props.sender_type === _SupportTicketSenderType.USER;

    return (
        <View style={[styles.wrapper, isUser ? styles.alignRight : styles.alignLeft]}>
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.systemBubble]}>
                <Paragraph style={styles.messageText}>{props.message}</Paragraph>
                <Paragraph style={styles.timeText}>
                    {formatMessageTime(props.created_at)}
                </Paragraph>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 10,
    },
    alignRight: {
        justifyContent: 'flex-end',
    },
    alignLeft: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 12,
    },
    userBubble: {
        backgroundColor: DefaultColor.yellow[200],
        borderTopRightRadius: 0,
    },
    systemBubble: {
        backgroundColor: '#eee',
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: '#000',
        fontSize: 15,
    },
    timeText: {
        color: '#888',
        fontSize: 11,
        textAlign: 'right',
        marginTop: 4,
    },
});