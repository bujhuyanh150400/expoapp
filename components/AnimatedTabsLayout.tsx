import { useState, ReactNode } from 'react'
import {
    Tabs,
    AnimatePresence,
    YStack,
    SizableText,
    TabLayout,
    TabsTabProps,
    styled,
    StackProps,
} from 'tamagui'
import { LayoutRectangle } from 'react-native'

export type TabItem = {
    label: string
    value: string
    content: ReactNode
}

type AnimatedTabsLayoutProps = {
    tabs: TabItem[]
    initialTab?: string
}

export default function AnimatedTabsLayout({ tabs, initialTab }: AnimatedTabsLayoutProps) {
    const [tabState, setTabState] = useState<{
        currentTab: string
        intentAt: TabLayout | null
        activeAt: TabLayout | null
        prevActiveAt: TabLayout | null
    }>({
        currentTab: initialTab || tabs[0].value,
        intentAt: null,
        activeAt: null,
        prevActiveAt: null,
    })

    const { currentTab, intentAt, activeAt, prevActiveAt } = tabState

    const setCurrentTab = (currentTab: string) =>
        setTabState({ ...tabState, currentTab })

    const setIntentIndicator = (intentAt: LayoutRectangle | null) =>
        setTabState({ ...tabState, intentAt })

    const setActiveIndicator = (activeAt: LayoutRectangle | null) =>
        setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })

    const direction = (() => {
        if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) return 0
        return activeAt.x > prevActiveAt.x ? -1 : 1
    })()

    const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
        if (type === 'select') {
            setActiveIndicator(layout)
        } else {
            setIntentIndicator(layout)
        }
    }

    return (
        <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            activationMode="manual"
            orientation="horizontal"
            flexDirection="column"
        >
            <YStack>
                <AnimatePresence>
                    {intentAt && (
                        <TabsRovingIndicator
                            width={intentAt.width}
                            height="$0.5"
                            x={intentAt.x}
                            bottom={0}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {activeAt && (
                        <TabsRovingIndicator
                            theme="accent"
                            active
                            width={activeAt.width}
                            height="$0.5"
                            x={activeAt.x}
                            bottom={0}
                        />
                    )}
                </AnimatePresence>
                <Tabs.List
                    aria-label="Tab Navigation"
                    borderBottomWidth="$0.5"
                    loop={false}
                    borderColor="$color3"
                    paddingBottom="$1.5"
                    backgroundColor="transparent"
                    disablePassBorderRadius
                >
                    {tabs.map((tab) => (
                        <CustomTab
                            key={tab.value}
                            value={tab.value}
                            isSelected={currentTab === tab.value}
                            onInteraction={handleOnInteraction}
                        >
                            <SizableText
                                color={currentTab === tab.value ? '$color10' : '$color9'}
                                fontWeight={currentTab === tab.value ? 'bold' : 'normal'}
                            >
                                {tab.label}
                            </SizableText>
                        </CustomTab>
                    ))}
                </Tabs.List>
            </YStack>

            <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
                <AnimatedYStack key={currentTab}>
                    <Tabs.Content key={currentTab} value={currentTab} forceMount flex={1}>
                        {tabs.find((tab) => tab.value === currentTab)?.content}
                    </Tabs.Content>
                </AnimatedYStack>
            </AnimatePresence>
        </Tabs>
    )
}

const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => (
    <YStack
        position="absolute"
        backgroundColor="transparent"
        opacity={0.7}
        animation="100ms"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        {...(active && {
            backgroundColor: '$color8',
            opacity: 0.6,
        })}
        {...props}
    />
)

const AnimatedYStack = styled(YStack, {
    flex: 1,
    x: 0,
    opacity: 1,
    animation: '100ms',
    variants: {
        direction: {
            ':number': (direction) => ({
                enterStyle: {
                    x: direction > 0 ? -25 : 25,
                    opacity: 0,
                },
                exitStyle: {
                    zIndex: 0,
                    x: direction < 0 ? -25 : 25,
                    opacity: 0,
                },
            }),
        },
    } as const,
})

const CustomTab = styled(Tabs.Tab, {
    name: 'CustomTab',
    unstyled: true,
    paddingHorizontal: '$3',
    paddingVertical: '$2',
    backgroundColor: 'red !important',
    variants: {
        isSelected: {
            true: {
                backgroundColor: 'transparent',
            },
            false: {
                backgroundColor: 'transparent',
            },
        },
    },

})