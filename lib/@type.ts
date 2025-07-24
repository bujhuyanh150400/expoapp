import DefaultColor from "@/components/ui/DefaultColor";
import {FontAwesome6, MaterialIcons} from "@expo/vector-icons";
import React from "react";

/**
 * Auth types
 */
export enum _AuthStatus {
    NEED_ACCESS_PIN = 'need_access_pin',
    AUTHORIZED = 'authorized',
    UNAUTHORIZED = 'unauthorized',
}


/**
 * Account types
 */
export enum _AccountType {
    TEST_ACCOUNT = 0,
    REAL_ACCOUNT = 1,
}

/**
 * Time frame types
 */
export enum _Timeframe {
    OneMinute = '1min',
    FiveMinute = '5min',
    FifteenMinutes = '15min',
    ThirtyMinutes = '30min',
    FortyFiveMinutes = '45min',
    OneHour = '1h',
    OneDay = '1day',
    OneWeek = '1week',
}
export enum _TypeChart {
    CANDLE = "CANDLE",
    LINE = "LINE",
}



/**
 * Verìfy user status types
 */
export enum _VerifyUserStatus {
    ACTIVE = 1,
    INACTVE = 2,
    WAITING = 3,
}

export enum _AssetType {
    CRYPTO = 1,
    ENERGY = 2,
    METAL = 3,
    FAVORITE = 5,
}

export enum _SupportTicketType {
    TECHNICAL = 1,
    PAYMENT = 2,
    TRANSACTION = 3,
}

export enum _SupportTicketStatus {
    OPEN = 1,
    CLOSED = 2,
}

export enum _SupportTicketSenderType {
    USER = 1,
    AGENT = 2,
}

export enum _SupportTicketPriority {
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
}

export const PRIORITY_CONFIG = {
    [_SupportTicketPriority.LOW]: {
        text: 'Thấp',
        color: DefaultColor.green[200],
    },
    [_SupportTicketPriority.MEDIUM]: {
        text: 'Trung bình',
        color: DefaultColor.yellow[200],
    },
    [_SupportTicketPriority.HIGH]: {
        text: 'Cao',
        color: DefaultColor.red[200],
    },
};

export const TIME_FRAME_SELECT = [
    {label: '1 phút', unit: "1m", value: _Timeframe.OneMinute},
    {label: '5 phút', unit: "5m", value: _Timeframe.FiveMinute},
    {label: '30 phút', unit: "30m", value: _Timeframe.ThirtyMinutes},
    {label: '45 phút', unit: "45m", value: _Timeframe.FortyFiveMinutes},
    {label: '1 giờ', unit: "1h", value: _Timeframe.OneHour},
    {label: '1 ngày', unit: "1d", value: _Timeframe.OneDay},
    {label: '1 tuần', unit: "1w", value: _Timeframe.OneWeek},
];


export enum _TradeType {
    BUY = 0,
    SELL = 1,
}

export enum _TransactionTriggerType {
    TYPE_TRIGGER_NOW = 1,
    TYPE_TRIGGER_AUTO_TRIGGER = 2,
    TYPE_TRIGGER_LOW_BUY = 3,
    TYPE_TRIGGER_HIGH_BUY = 4
}

export enum _TransactionStatus {
    OPEN = 1,
    CLOSED = 2,
    WAITING = 3,
}
