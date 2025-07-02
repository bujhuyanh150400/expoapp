import {_SupportTicketPriority, _SupportTicketSenderType, _SupportTicketStatus, _SupportTicketType} from "@/lib/@type";


export interface Ticket {
    id: number;
    parent_id: number | null;
    user_id: number;
    type: _SupportTicketType;
    message: string;
    priority: _SupportTicketPriority;
    status: _SupportTicketStatus;
    sender_type: _SupportTicketSenderType;
    created_at: string;
}

export type ListTicketRequest = {
    keyword?: string;
    status?: _SupportTicketStatus | '';
    per_page?: number;
    page?: number;
}

export type ListTicketResponse = {
    data: Ticket[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type CreateTicketRequest = {
    message: string;
    type: _SupportTicketType;
    priority: _SupportTicketPriority
}

export type ReplyTicketRequest = {
    message: string;
    id: number;
}