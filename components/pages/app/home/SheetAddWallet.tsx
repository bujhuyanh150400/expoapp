import {Button, ListItem, Separator, Sheet, YGroup, AnimatePresence } from "tamagui";
import {useState, Dispatch, SetStateAction, useRef} from "react";
import {Dimensions, Text, View} from "react-native";
import {useSharedValue} from "react-native-reanimated";
import Carousel, {
    ICarouselInstance,
    Pagination,
} from "react-native-reanimated-carousel";
import {ChevronRight} from '@tamagui/lucide-icons'


const StepOne = () => {
    return (
        <View>
            <Text>Step 1</Text>
        </View>
    )
}

const StepTwo = () => {
    return (
        <View>
            <Text>Step 2</Text>
        </View>
    )
}

const StepThree = () => {
    return (
        <View>
            <Text>Step 3</Text>
        </View>
    )
}

const steps = [
    <StepOne/>,
    <StepTwo/>,
    <StepThree/>
]

enum _StepAddWallet {
    STEP_ONE = 0,
    STEP_TWO = 1,
    STEP_THREE = 2,
}

const SheetAddWallet = ({open, setOpen}: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {

    const [snapPoint, setSnapPoint] = useState<number>(30);
    const [step, setStep] = useState<_StepAddWallet>(_StepAddWallet.STEP_ONE);

    const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1))
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));



    // const ref = useRef<ICarouselInstance>(null);
    // const progress = useSharedValue<number>(0);
    // const [carouselWidth, setCarouselWidth] = useState<number>(0);
    // const onPressPagination = (index: number) => {
    //     ref.current?.scrollTo({
    //         /**
    //          * Calculate the difference between the current index and the target index
    //          * to ensure that the carousel scrolls to the nearest index
    //          */
    //         count: index - progress.value,
    //         animated: true,
    //     });
    // };
    return <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[snapPoint]}
        zIndex={100_000}
        dismissOnSnapToBottom
        dismissOnOverlayPress
        animation="medium"
        modal={true}
    >
        <Sheet.Overlay
            animation="lazy"
            backgroundColor="$shadow6"
            enterStyle={{opacity: 0}}
            exitStyle={{opacity: 0}}
        />
        <Sheet.Handle/>
        <Sheet.Frame padding={8} onLayout={(e) => {
            const {width} = e.nativeEvent.layout;
        }}>
            <YGroup separator={<Separator/>}>
                <YGroup.Item>
                    <ListItem
                        title="Tài khoản thật"
                        subTitle="Tài khoản không rủi ro. Giao dịch bằng tiền ảo"
                        backgroundColor={"white"}
                        pressTheme
                        iconAfter={ChevronRight}/>
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem
                        title="Tài khoản credit"
                        subTitle="Giao dịch bằng tiền thật và rút bất kỳ khoản lợi nhuận nào bạn kiếm được"
                        backgroundColor={"white"}
                        pressTheme
                        iconAfter={ChevronRight}
                    />
                </YGroup.Item>
            </YGroup>
        </Sheet.Frame>
    </Sheet>
}
export default SheetAddWallet;


