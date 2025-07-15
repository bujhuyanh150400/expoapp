import {Dimensions, NativeScrollEvent, NativeSyntheticEvent, Text, View} from "react-native";
import {FC, useContext, useEffect, useRef, useState} from "react";
import {LineChart as LineChartWagmi, LineChartDimensionsContext, } from "react-native-wagmi-charts";
import Svg, {Line} from "react-native-svg";
import { LineChartType} from "@/components/chart/type";
import {_Timeframe} from "@/lib/@type";
import DefaultColor from "@/components/ui/DefaultColor";
import {ScrollView} from "react-native-gesture-handler";
import dayjs from 'dayjs';
import { throttle } from 'lodash';

const screenWidth = Dimensions.get('window').width;

const LastPriceLine = () => {
    const { data, domain } = LineChartWagmi.useChart();
    const { height, width, gutter } = useContext(LineChartDimensionsContext);

    const [min, max] = domain;

    if (!data || data.length === 0 || height === 0 || width === 0 || max === min) return null;

    const lastClose = data[data.length - 1].value;

    // Tính vị trí Y dựa trên giá trị
    const offsetTop = max - lastClose;
    const percentOffset = offsetTop / (max - min);
    const y = gutter + percentOffset * (height - gutter * 2);

    return (
        <>
            {/* Đường kẻ ngang */}
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                }}
            >
                <Svg height={height} width={screenWidth}>
                    <Line
                        x1={width}
                        y1={y}
                        x2={screenWidth - 40}
                        y2={y}
                        stroke={DefaultColor.blue[500]}
                        strokeDasharray="4,2"
                        strokeWidth={1}
                    />
                </Svg>
            </View>

            {/* Badge giá */}
            <View
                style={{
                    position: 'absolute',
                    top: y - 10,
                    right: 0,
                    backgroundColor: DefaultColor.blue[500],
                    paddingHorizontal: 8,
                    borderRadius: 4,
                }}
            >
                <Text style={{ color: 'white', fontSize: 12 }}>{lastClose}</Text>
            </View>
        </>
    );
};

const YAxisLabels = () => {
    const { domain } = LineChartWagmi.useChart();
    const { height } = useContext(LineChartDimensionsContext);
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
    const { data } = LineChartWagmi.useChart();

    if (!data || data.length === 0) return null;
    const { width , gutter} = useContext(LineChartDimensionsContext);

    const spacing = (width - gutter * 2) / (data.length - 1);
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

type PropLineChart = {
    data: LineChartType[] ,
    timeFrame?: _Timeframe,
    height?:number,
};

const LineChart : FC<PropLineChart>= ({data, timeFrame, height}) => {
    const [timeType, setTimeType] = useState<'day' | 'hour'>('hour');

    useEffect(() => {
        if (timeFrame){
            if ([_Timeframe.OneMinute,_Timeframe.FifteenMinutes,_Timeframe.ThirtyMinutes,_Timeframe.FortyFiveMinutes, _Timeframe.OneHour].includes(timeFrame)){
                setTimeType('hour');
            }else{
                setTimeType('day');
            }
        }
    }, [timeFrame]);

    const pointSpacing = 20;

    const chartWidth = (data.length - 1) * pointSpacing;

    const scrollRef = useRef<ScrollView>(null);

    // const loadingLeftRef = useRef(false);
    // const throttledScrollLeft = useRef(
    //     throttle(async () => {
    //         if (loadingLeftRef.current || !handleScrollLeft) return;
    //         loadingLeftRef.current = true;
    //         try {
    //             handleScrollLeft(); // gọi API hoặc gì đó
    //         } finally {
    //             loadingLeftRef.current = false;
    //         }
    //     }, 2000, { trailing: false }) // giới hạn 1 lần mỗi 1000ms
    // ).current;
    //
    // useEffect(() => {
    //     if (scrollRef.current) {
    //         scrollRef.current.scrollToEnd({ animated: false });
    //     }
    // }, []);
    //
    // const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    //     const {
    //         contentOffset: { x },
    //     } = e.nativeEvent
    //     // Gần đầu trái
    //     if (x <= 0 && handleScrollLeft) {
    //         throttledScrollLeft();
    //     }
    // }

    return (
        <>
            <LineChartWagmi.Provider data={data}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ width: chartWidth }}
                >
                    <View style={{width: chartWidth}}>
                        <LineChartWagmi height={height ?? 200} width={chartWidth - 130}>
                            <YAxisLabels />
                            <LineChartWagmi.Path pathProps={{strokeWidth: 1}}>
                                <LineChartWagmi.Dot size={3} at={data.length - 1} />
                                <LineChartWagmi.HorizontalLine color={DefaultColor.blue[500]} at={{ index: data.length - 1 }} />
                            </LineChartWagmi.Path>
                            <XAxisLabels timeType={timeType}/>
                            <LastPriceLine />
                        </LineChartWagmi>
                    </View>
                </ScrollView>
            </LineChartWagmi.Provider>
        </>
    )
}

export default LineChart;