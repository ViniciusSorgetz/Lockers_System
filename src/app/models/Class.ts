import mongoose, { Types } from "mongoose";

export interface Student{
    _id?: Types.ObjectId;
    name: string,
    phone_number?: string
}

export interface IClass{
    _id?: Types.ObjectId
    code: string,
    students: Student[]
}

const classSchema = new mongoose.Schema<IClass>({
    code: {
        type: String,
        required: true
    },
    students: [
        {
            name: {
                type: String,
                required: true,
            },
            phone_number: {
                type: String,
                required: false,
            }
        }
    ]
});

const Class : mongoose.Model<IClass> = mongoose.models.Class || mongoose.model<IClass>("Class", classSchema);

export default Class;