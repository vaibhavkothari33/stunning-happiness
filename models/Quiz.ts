import { models, model, Schema, Types } from "mongoose";
import { IQuestion } from "./Questions";

export interface IQuiz extends Document {
    title: string;
    description: string;
    question: Types.ObjectId[] | IQuestion[];
    totalQuestions: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const QuizSchema = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question", required: true }],
    totalQuestions: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, required: true },
}, { timestamps: true })

QuizSchema.pre("save", function (next) {
    this.totalQuestions = this.questions.length;
    next();
})

const Quiz = models?.Quiz || model<IQuiz>("Quiz", QuizSchema)

export default Quiz