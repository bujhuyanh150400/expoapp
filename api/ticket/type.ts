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

export type ListTicketResponse  = {
    message: string;
    data: Ticket[];
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