import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {Link} from "expo-router";
import {APP_NAME} from "@/lib/constant";
import { useAssets } from 'expo-asset';
import {useVideoPlayer, VideoView} from 'expo-video';


export default function OnboardScreen() {
    const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
    const player = useVideoPlayer({
        uri: assets && assets.length > 0 ? assets[0].uri : undefined
    }, player => {
        player.play();
        player.loop = true;
        player.muted = true;
    });
    return (
        <View style={styles.container}>
            {assets && (
                <VideoView
                    contentFit="cover"
                    player={player}
                    style={styles.video}
                    nativeControls={false}
                />
            )}
            <View style={{ marginTop: 80, padding: 20 }}>
                <Text style={styles.app_name}>{APP_NAME}</Text>
                <Text style={styles.header}>Sẵn sàng để thay đổi cách bạn kiếm tiền?</Text>
            </View>

            <View style={styles.buttons}>
                <Link
                    href={'/(auth)/login'}
                    style={[styles.button,{
                        backgroundColor: '#141518'
                    }]}
                    asChild>
                    <TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Đăng nhập</Text>
                    </TouchableOpacity>
                </Link>
                <Link
                    href={'/(auth)/register'}
                    style={[styles.button, { backgroundColor: '#fff' }]}
                    asChild>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '500' }}>Đăng ký</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    app_name: {
        fontSize: 30,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: 'white',
        marginBottom: 20
    },
    header: {
        fontSize: 36,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: 'white',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    button: {
        padding: 10,
        height: 50,
        flex: 1,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    }
});