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
  id: string
  formId: string
  responses: Record<string, any>
  submittedAt: Date
}
