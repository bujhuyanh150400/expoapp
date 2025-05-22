import React, { useRef } from 'react';

import LayoutScrollApp from "@/components/LayoutScrollApp";
import {Button, Card, H5, H6, Paragraph, Separator, SizableText, Tabs, TabsContentProps, XStack} from 'tamagui';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function HomeScreen() {


    return (
        <LayoutScrollApp title="Tài khoản">
            <Card elevate size="$4" bordered >
                <Card.Header padded>
                    <H6 fontWeight="bold" paddingBottom={12}>Không có tài khoản nào đang hoạt động</H6>
                    <Paragraph theme="alt2">Mở tài khoản mới hoặc restore 1 tài khoản</Paragraph>
                </Card.Header>
                <Card.Footer alignItems="center" justifyContent="center" gap="$2" padded>
                    <Button borderRadius="100%">
                        <FontAwesome6 name="add" size={12} color="black" />
                    </Button>
                    <Button borderRadius="100%">
                        <FontAwesome6 name="box-archive" size={12} color="black" />
                    </Button>
                </Card.Footer>
            </Card>
            <Tabs
                defaultValue="tab1"
                orientation="horizontal"
                flexDirection="column"
                borderRadius="$4"
                borderWidth="$0.25"
                overflow="hidden"
                borderColor="$borderColor"
            >
                <Tabs.List
                    separator={<Separator vertical />}
                    disablePassBorderRadius="bottom"
                    aria-label="Manage your account"
                >
                    <Tabs.Tab
                        focusStyle={{
                            backgroundColor: '$color3',
                        }}
                        flex={1}
                        value="tab1"
                    >
                        <SizableText fontFamily="$body" textAlign="center">
                            Profile
                        </SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        focusStyle={{
                            backgroundColor: '$color3',
                        }}
                        flex={1}
                        value="tab2"
                    >
                        <SizableText fontFamily="$body" textAlign="center">
                            Connections
                        </SizableText>
                    </Tabs.Tab>
                    <Tabs.Tab
                        focusStyle={{
                            backgroundColor: '$color3',
                        }}
                        flex={1}
                        value="tab3"
                    >
                        <SizableText fontFamily="$body" textAlign="center">
                            Notifications
                        </SizableText>
                    </Tabs.Tab>
                </Tabs.List>
                <Separator />
                <TabsContent value="tab1">
                    <H5>Profile</H5>
                </TabsContent>

                <TabsContent value="tab2">
                    <H5>Connections</H5>
                </TabsContent>

                <TabsContent value="tab3">
                    <H5>Notifications</H5>
                </TabsContent>
            </Tabs>
        </LayoutScrollApp>
    );
}

const TabsContent = (props: TabsContentProps) => {
    return (
        <Tabs.Content
            backgroundColor="$background"
            key="tab3"
            padding="$2"
            alignItems="center"
            justifyContent="center"
            flex={1}
            borderColor="$background"
            borderRadius="$2"
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            borderWidth="$2"
            {...props}
        >
            {props.children}
        </Tabs.Content>
    )
}

