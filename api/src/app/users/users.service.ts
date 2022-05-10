import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import * as bcrypt from 'bcrypt';

import {User, UserDocument} from './users.model';
import {GetUserInput, RegisterUserInput, UpdateUserNameInput} from './users.inputs';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {
    }

    async register(payload: RegisterUserInput) {
        console.log('---bcrypt', bcrypt);

        const pass = await bcrypt.hash(payload.password, 10);
        const createdUser = new this.userModel({
            ...payload,
            password: pass,
        });
        return createdUser.save();
    }

    findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    findByIdNoPass(id: string) {
        return this.userModel.findById(id)
            .select(['-password'])
    }

    findOne(filters: GetUserInput) {
        return this.userModel.findOne({...filters})
    }

    updateName(payload: UpdateUserNameInput) {
        return this.userModel
            .findByIdAndUpdate(payload._id, payload, {new: true})
            .exec();
    }

    /*delete(_id: MongooseSchema.Types.ObjectId) {
        return this.userModel.findByIdAndDelete(_id).exec();
    }*/
}
