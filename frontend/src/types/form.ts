export interface Question {
  id: string
  type: 'categorize' | 'cloze' | 'comprehension'
  title: string
  description: string
  required: boolean
  image: string
  options: any
}

export interface FormData {
  id: string
  title: string
  description: string
  headerImage: string
  questions: Question[]
  createdAt: Date
  updatedAt: Date
}

export interface FormResponse {
  _id?: string // Optional because MongoDB auto-generates this
  formId: string
  responses: Record<string, any>
  submittedAt?: Date // Optional because it has a default value
}

/*
export type QuestionType = 'categorize' | 'cloze' | 'comprehension';

export interface CategorizeOptions {
  categories: string[];
  items: {
    text: string;
    category: string;
  }[];
}

export interface ClozeOptions {
  textWithBlanks: string;
  blanks: string[];
}

export interface ComprehensionOptions {
  passage: string;
  subQuestions: {
    questionText: string;
    answerType: 'text' | 'mcq';
  }[];
}

export type QuestionOptions =
  | CategorizeOptions
  | ClozeOptions
  | ComprehensionOptions;

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description: string;
  required: boolean;
  image: string;
  options: QuestionOptions;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  headerImage: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: Date;
}

*/