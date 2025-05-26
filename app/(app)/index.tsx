import React from 'react';

import LayoutScrollApp from "@/components/LayoutScrollApp";
import {
    Button,
    Card,
    H6,
    Paragraph, YStack,
} from 'tamagui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AnimatedTabsLayout, {TabItem} from "@/components/AnimatedTabsLayout";
import SheetAddWallet from "@/components/pages/app/home/SheetAddWallet";

const tabs: TabItem[] = [
    {
        label: 'Mở',
        value: 'open',
        content: <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center" gap="$4">
            <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch mở</Paragraph>
            <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên thế giới</Paragraph>
        </YStack>,
    },
    {
        label: 'Đang chờ',
        value: 'waiting',
        content: <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center" gap="$4">
            <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch mở</Paragraph>
            <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên thế giới</Paragraph>
        </YStack>,
    },
    {
        label: 'Đã đóng',
        value: 'closed',
        content: <YStack flex={1} paddingTop={20} paddingBottom={20} alignItems="center" justifyContent="center" gap="$4">
            <Paragraph fontWeight="bold" theme="alt2">Không có lệnh giao dịch mở</Paragraph>
            <Paragraph textAlign="center" theme="alt2">Tận dụng cơ hội giao dịch trên các thị trường tài chính lớn trên thế giới</Paragraph>
        </YStack>,
    },
]
export default function HomeScreen() {

    const [openSheetAddWallet, setOpenSheetAddWallet] = React.useState(false);

    return (
        <LayoutScrollApp title="Tài khoản">
            <Card elevate size="$4" bordered backgroundColor="white" marginBottom={15}>
                <Card.Header padded>
                    <H6 fontWeight="bold" paddingBottom={12}>Không có tài khoản nào đang hoạt động</H6>
                    <Paragraph theme="alt2">Mở tài khoản mới hoặc restore 1 tài khoản</Paragraph>
                </Card.Header>
                <Card.Footer alignItems="center" justifyContent="center" gap="$2" padded>
                    <Button
                        borderRadius="100%"
                            icon={<FontAwesome6 name="add" size={10} color="black" />}
                        onPress ={() => setOpenSheetAddWallet(true)}
                    />
                    <Button borderRadius="100%" icon={<FontAwesome6 name="box-archive" size={10} color="black" />}/>
                </Card.Footer>
            </Card>
            <AnimatedTabsLayout tabs={tabs} initialTab="open" />
            <SheetAddWallet open={openSheetAddWallet} setOpen={setOpenSheetAddWallet} />
        </LayoutScrollApp>
    );
}


