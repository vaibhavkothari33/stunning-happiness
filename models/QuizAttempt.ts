import { models, model, Schema, Types } from "mongoose"
import { IUser } from "./User"
import { IQuiz } from "./Quiz";

export interface IQuizAttempt extends Document {
    userId: Types.ObjectId | IUser;
    quizId: Types.ObjectId | IQuiz;
    currentQuestionIndex: number;
    score: number;
    startedAt: Date;
    finishedAt: Date;
    isCompleted: boolean;
    answer: {
        questionId: Types.ObjectId;
        submittedAnswer: string;
        isCorrect: boolean;
        answeredAt: Date;
    }[];

    createdAt: Date;
    updatedAt: Date;
}

const QuizAttemptSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    currentQuestionIndex: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    answer: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
            submittedAnswer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            answeredAt: { type: Date, default: Date.now }, ///////
        }
    ]
}, { timestamps: true })

QuizAttemptSchema.index({ userId: 1, quizId: 1 }, { unique: true, partialFilterExpression: { isCompleted: false } });

const QuizAttempt = models?.QuizAttempt || model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema)

export default QuizAttempt