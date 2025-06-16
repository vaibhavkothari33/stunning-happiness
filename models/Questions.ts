import { model, models, Schema, } from "mongoose";

export interface IQuestion extends Document {
    questionText: string;
    correctAnswer: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;

}

const questionSchema = new Schema({
    questionText: { type: String, require: true },
    imageUrl:{type:String},
    correctAnswer:{type:String, required:true},
    category:{type:String}

}, { timestamps: true })

const Question = models?.Question || model<IQuestion>("Question",questionSchema)

export default Question