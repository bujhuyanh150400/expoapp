import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(204,204,204,1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
const FullScreenLoading = ({loading} : {loading:boolean}) => {
    return (
        <>
            {loading && <View style={styles.container}>
                <ActivityIndicator size="large" color="#00bfff" />
            </View>}
        </>
    );
}

export default FullScreenLoading;