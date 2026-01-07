import { ObjectId } from "mongoose";

export interface T {
    [key: string]: any;
}

export interface StatisticModifier {
    _id: ObjectId; //ixtyoriy collection  doc idsi
    targetKey: string;//Datasate nomi
    modifier: number; // qanday qiymatga ozgartrmoqchimi
}