import {Account} from "@/api/account/type";
import React, {FC} from "react";
import {_TransactionTriggerType} from "@/lib/@type";
import {Paragraph} from "tamagui";
import DefaultColor from "@/components/ui/DefaultColor";
import HorizontalTabBar from "@/components/HorizontalTabBar";


type Props = {
    account: Account | null,
}

const TransactionTabs: FC<Props> = (props) => {


    return (
        <>
            <HorizontalTabBar<_TransactionTriggerType>
                tabs={[
                    {
                        key: _TransactionTriggerType.TYPE_TRIGGER_AUTO_TRIGGER,
                        item: (isActive) => (
                            <Paragraph
                                style={{
                                    color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                    fontWeight: isActive ? 700 : 'normal'
                                }}
                            >
                                Lệnh thị trường
                            </Paragraph>
                        ),
                    },
                    {
                        key: _TransactionTriggerType.TYPE_TRIGGER_LOW_BUY,
                        item: (isActive) => (
                            <Paragraph
                                style={{
                                    color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                    fontWeight: isActive ? 700 : 'normal'
                                }}
                            >
                                Chờ mua giá thấp
                            </Paragraph>
                        ),
                    },
                    {
                        key: _TransactionTriggerType.TYPE_TRIGGER_HIGH_BUY,
                        item: (isActive) => (
                            <Paragraph
                                style={{
                                    color: isActive ? DefaultColor.black : DefaultColor.slate[300],
                                    fontWeight: isActive ? 700 : 'normal'
                                }}
                            >
                                Chờ mua giá cao
                            </Paragraph>
                        ),
                    },
                ]}
                activeKey={tab}
                onTabPress={setTab}
                style={{
                    marginBottom: 20
                }}
            />

        </>
    )
}

export default TransactionTabs;