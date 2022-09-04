import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DateDocument, Date } from './date.model';
import {IDate, IDateIndex} from './date.types';

@Injectable()
export class DateService {
    constructor(@InjectModel(Date.name) private dateModel: Model<DateDocument>) {}

    async createDate({index, lastUpdate}: IDate) {
        const createdDate = new this.dateModel({
            index,
            lastUpdate
        });
        return createdDate.save();
    }

    async updateDate({index, lastUpdate}: IDate) {
        return this.dateModel
            .findOneAndUpdate({index}, {lastUpdate}, { new: false })
            .exec();
    }

    async findByIndex({index}: IDateIndex) {
        const one = await this.dateModel.findOne({index}).exec();
        if (one) {
            return one
        }
        throw 'not found';
    }

}
