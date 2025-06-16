import {Dimensions, Text, View} from "react-native";
import {CandlestickChart, LineChartDimensionsContext} from "react-native-wagmi-charts";
import Svg, {Line} from "react-native-svg";
import {useContext, useEffect, useRef, useState} from "react";
import {runOnJS, useDerivedValue} from "react-native-reanimated";
import DefaultColor from "@/components/ui/DefaultColor";
import {_Timeframe} from "@/lib/@type";
import {CandleChartType} from "@/components/chart/type";
import dayjs from "dayjs";
import {ScrollView} from "react-native-gesture-handler";

const screenWidth = Dimensions.get('window').width;

const LastPriceLine = () => {
    const {data, domain, height, width, step} = CandlestickChart.useChart();
    const [min, max] = domain;

    if (!data || data.length === 0 || height === 0 || width === 0 || max === min) return null;

    const lastClose = data[data.length - 1].close;

    // Convert price to y position (0 = top, height = bottom)
    const y = ((max - lastClose) / (max - min)) * height;
    // Tính x từ step là khoảng cách giữa 2 cây nến (dạng pixel), nến cuối = (data.length - 1)
    const x = step * (data.length - 1);

    return (
        <>
            {/* Đường giá từ cuối cây nến tới hết biểu đồ */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none', // để không ảnh hưởng tới touch
                }}
            >
                <Svg
                    height={height}
                    width={width}
                >
                    <Line
                        x1={0}
                        y1={y}
                        x2={width}
                        y2={y}
                        stroke={DefaultColor.blue[500]}
                        strokeDasharray="4,2"
                        strokeWidth={1}
                    />
                </Svg>
            </View>

            {/* Label giá nằm ngay sau cây nến cuối */}
            <View
                style={{
                    position: 'absolute',
                    top: y - 10,
                    left: x + 40, // left 40 + padding 2
                    backgroundColor: DefaultColor.blue[500],
                    paddingHorizontal: 8,
                    borderRadius: 4,
                }}
            >
                <Text style={{color: 'white', fontSize: 12}}>{lastClose}</Text>
            </View>
        </>
    );
};

const YAxisLabels = () => {
    const { domain, height } = CandlestickChart.useChart();
    if (!domain) return null;

    const [min, max] = domain;
    const steps = 4;
    const step = (max - min) / steps;
    const labels = Array.from({ length: steps + 1 }, (_, i) =>
        (min + step * i).toFixed(2)
    ).reverse();
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                right: 0,
                height: height,
                width:"100%",
                justifyContent: 'space-between',
            }}
        >
            {labels.map((label, i) => (
                <View
                    key={i}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: "100%",
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            marginRight: 4,
                        }}
                    />
                    <Text style={{ fontSize: 10 }}>{label}</Text>
                </View>
            ))}
        </View>
    );
};

const XAxisLabels = ({timeType} :{timeType?: 'day' | 'hour'}) => {
    const { data, width, step } = CandlestickChart.useChart();

    if (!data || data.length === 0) return null;

    // const spacing = (width - gutter * 2) / (data.length - 1);
    const spacing = (width - step * 2) / (data.length - 1);
    const labelEvery = Math.ceil(data.length / 40);

    return (
        <View
            style={{
                flexDirection: 'row',
                marginTop: 8,
                marginLeft: 0,
                width:"100%",
                gap: (spacing)
            }}
        >
            {data.map((item, index) => {
                const label = timeType === 'hour'
                    ? dayjs(item.timestamp).format('HH:mm')
                    : dayjs(item.timestamp).format('DD/MM');

                return (
                    <View
                        key={`xlabel-${index}`}
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        {index % labelEvery === 0 ? (
                            <Text style={{ fontSize: 10, color: '#666' }}>
                                {label}
                            </Text>
                        ) : null}
                    </View>
                );
            })}
        </View>
    );
};

const CandleChart = ({data, timeFrame}: { data: CandleChartType[] , timeFrame?: _Timeframe}) => {
    const [timeType, setTimeType] = useState<'day' | 'hour'>('hour');

    useEffect(() => {
        if (timeFrame){
            if ([_Timeframe.OneMinute,_Timeframe.FifteenMinutes,_Timeframe.ThirtyMinutes,_Timeframe.FortyFiveMinutes].includes(timeFrame)){
                setTimeType('hour');
            }else{
                setTimeType('day');
            }
        }
    }, [timeFrame]);


    const chartWidth = (data.length - 1) * 20;

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: false });
        }
    }, []);

    return (
        <CandlestickChart.Provider data={data}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ width: chartWidth }}
            >
                <View style={{width: chartWidth}}>
                    <CandlestickChart height={200} width={chartWidth - (130)}>
                        <YAxisLabels/>
                        <CandlestickChart.Candles/>
                        <XAxisLabels timeType={timeType}/>
                        <LastPriceLine/>
                    </CandlestickChart>
                </View>
            </ScrollView>

        </CandlestickChart.Provider>
    )
}

export default CandleChart;


