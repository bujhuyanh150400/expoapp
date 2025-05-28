import {Button, ListItem, Separator, Sheet, YGroup, AnimatePresence } from "tamagui";
import {useState, Dispatch, SetStateAction, useRef} from "react";
import {Dimensions, Text, View} from "react-native";
import {ChevronRight} from '@tamagui/lucide-icons'
import {_AccountType} from "@/lib/@type";

enum _StepAddWallet {
    STEP_ONE = 1,
    STEP_TWO = 2,
}

const AddAccountLayout = ({open, setOpen}: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {

    const [snapPoint, setSnapPoint] = useState<number>(25);
    const [step, setStep] = useState<_StepAddWallet>(_StepAddWallet.STEP_ONE);
    const [accountType, setAccountType] = useState<_AccountType | null>(null);


    const setNextStep = (type: _AccountType) => {
        setStep(_StepAddWallet.STEP_TWO);
        setSnapPoint(80)
        setAccountType(type);
    }

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
            <View style={{flex : 1}}>
                {/*Step 1*/}
                {step === _StepAddWallet.STEP_ONE &&
                    <YGroup separator={<Separator/>}>
                        <YGroup.Item>
                            <ListItem
                                title="Tài khoản thật"
                                subTitle="Tài khoản không rủi ro. Giao dịch bằng tiền ảo"
                                backgroundColor={"white"}
                                pressTheme
                                iconAfter={ChevronRight}
                                onPress={() => setNextStep(_AccountType.REAL_ACCOUNT)}
                            />
                        </YGroup.Item>
                        <YGroup.Item>
                            <ListItem
                                title="Tài khoản credit"
                                subTitle="Giao dịch bằng tiền thật và rút bất kỳ khoản lợi nhuận nào bạn kiếm được"
                                backgroundColor={"white"}
                                pressTheme
                                iconAfter={ChevronRight}
                                onPress={() => setNextStep(_AccountType.TEST_ACCOUNT)}
                            />
                        </YGroup.Item>
                    </YGroup>
                }
                {/*Step 2*/}

            </View>
        </Sheet.Frame>
    </Sheet>
}
export default AddAccountLayout;


