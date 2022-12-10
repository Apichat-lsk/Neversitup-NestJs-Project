import { Document } from 'mongoose';

export interface ProductDocument {

    readonly productName: string;
    readonly productTypeId: string;
    readonly price: number;
    readonly quantity: number;

}