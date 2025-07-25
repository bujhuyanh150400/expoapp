import useGetAccountActive from "@/lib/hooks/useGetAccountActive";
import TransactionTabs from "@/components/TransactionTabs";
import {View} from "react-native";
export default function TransactionScreen () {
    const {account} =  useGetAccountActive();

    return (
        <View style={{flex: 1, padding: 20, paddingTop: 0,}}>
            <TransactionTabs account={account} showTotal={true} allowScroll={true}/>
        </View>
    )
}