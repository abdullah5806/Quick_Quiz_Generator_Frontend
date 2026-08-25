import { z } from "zod";

export const addQuestionSchema = z.object({
  quizId: z.coerce
    .number()
    .positive("Quiz ID must be greater than 0"),

  question: z
    .string()
    .trim()
    .min(5, "Question must be at least 5 characters")
    .max(200, "Question must be at most 200 characters"),

  optionA: z
    .string()
    .trim()
    .min(1, "Option 1 is required")
    .max(100, "Option 1 must be at most 100 characters"),

  optionB: z
    .string()
    .trim()
    .min(1, "Option 2 is required")
    .max(100, "Option 2 must be at most 100 characters"),

  optionC: z
    .string()
    .trim()
    .min(1, "Option 3 is required")
    .max(100, "Option 3 must be at most 100 characters"),

  optionD: z
    .string()
    .trim()
    .min(1, "Option 4 is required")
    .max(100, "Option 4 must be at most 100 characters"),

  correctAns: z
    .string()
    .trim()
    .min(1, "Please select the correct answer"),

  marks: z.coerce
    .number()
    .min(1, "Marks must be at least 2")
    .max(100, "Marks must be at most 100"),
});