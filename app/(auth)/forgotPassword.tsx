import { YStack, H5, Paragraph, Button, Circle  } from 'tamagui'
import {View, SafeAreaView, Platform, KeyboardAvoidingView} from "react-native";


export default function ForgotPasswordScreen() {

    return (
        <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={64}
            >

            </KeyboardAvoidingView>
        </SafeAreaView>
        )
}