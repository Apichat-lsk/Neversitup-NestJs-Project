import { Document } from 'mongoose';

export interface OrderDocument {

    readonly userId: string;
    readonly productId: string;
    readonly quantity: number;
    readonly amount: number;
    readonly status: string;

}