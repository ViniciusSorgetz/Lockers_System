import mongoose, { Schema, Types } from "mongoose";

export interface History{
    start_date: Date,
    end_date: Date,
    reason: string,
}

export interface ILocker{
    building: "A" | "B" | "C" | "D",
    number: number,
    occupied: boolean,
    student_id?: Types.ObjectId,
    start_date?: Date,
    end_date?: Date,
    history: History[]
}

const lockerSchema:Schema = new mongoose.Schema({
        building: {
            type: String,
            enum: ["A", "B", "C", "D"],
            required: true
        },
        number: {
            type: Number,
            required: true
        },
        occupied: {
            type: Boolean,
            default: false,
            required: true
        },
        student_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false
        },
        start_date: {
            type: Date,
            required: false
        },
        end_date: {
            type: Date,
            required: false
        },
        history: [
            {
                start_date: {
                    type: Date,
                    required: true,
                },
                end_date: {
                    type: Date,
                    required: true,
                },
                reason: {
                    type: String,
                    required: false
                },
                student_id: {
                    type: mongoose.SchemaTypes.ObjectId,
                    required: true
                }
            }
        ]
});

const Locker = mongoose.models.Locker || mongoose.model<ILocker>("Locker", lockerSchema);

export default Locker;