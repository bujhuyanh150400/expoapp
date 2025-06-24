import {CreateTicketRequest, ListTicketResponse, ReplyTicketRequest} from "@/api/ticket/type";
import {client} from "@/api/client";
import {ResponseSuccessType} from "@/api/commonType";


const ticketAPI = {
    list: async (): Promise<ListTicketResponse> => {
        const response = await client.get('/tickets');
        return response.data;
    },
    create: async (data: CreateTicketRequest): Promise<ResponseSuccessType> => {
        const response = await client.post('/tickets', data);
        return response.data;
    },
    reply: async (data: ReplyTicketRequest): Promise<ResponseSuccessType> => {
        const response = await client.post(`/tickets/${data.id}/reply`, {
            data: {
                message: data.message
            }
        });
        return response.data;
    },
    getTicketThread: async (ticketId: number): Promise<ListTicketResponse> => {
        const res = await client.get(`/tickets/${ticketId}`);
        return res.data;
    },

}

export default ticketAPI;