import {z} from "zod"

export const createQuizSchema = z.object({
    title: z
    .string()
    .trim()
    .min(5, "Quiz Tittle at least 5 characters")
    .max(30, "Quiz Tittle at most 30 characters"),

    subject: z
    .string()
    .trim()
    .min(5, "Subject at least 5 characters")
    .max(30, "Subject at most 30 characters"),

    description: z
    .string()
    .trim()
    .min(5, "Description at least 5 characters")
    .max(30, "Description at most 30 characters"),

    duration: z.coerce
    .number()
    .min(10, "Duration at least 10 min")
    .max(100, "Duration at most 100 min"),

    totalMarks: z.coerce
    .number()
    .min(10, "Total Marks at least 10")
    .max(100, "Total Marks at most 100"),

    passingMarks: z.coerce
    .number()
    .min(3, "Passing Marks at least 3")
    .max(33, "Passing Marks at most 33")
});