import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormData, Question } from "@/types/form"
import CategorizePreview from "@/components/question-previews/CategorizePreview"
import ClozePreview from "@/components/question-previews/ClozePreview"
import ComprehensionPreview from "@/components/question-previews/ComprehensionPreview"
import axios from 'axios';
interface FormPreviewProps {
  formData: FormData
}

export default function FormPreview({ formData }: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateResponse = (questionId: string, response: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const resp = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/responses`)
      console.log('Submitting form responses:', {
        formId: formData.id,
        responses:resp,
        submittedAt: new Date()
      })
      
      alert('Form submitted successfully!')
      console.log("Form submit with response");
      setResponses({})
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting form')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderQuestionPreview = (question: Question) => {
    const response = responses[question.id]
    
    switch (question.type) {
      case 'categorize':
        return (
          <CategorizePreview
            question={question}
            response={response}
            onUpdate={(resp) => updateResponse(question.id, resp)}
          />
        )
      case 'cloze':
        return (
          <ClozePreview
            question={question}
            response={response}
            onUpdate={(resp) => updateResponse(question.id, resp)}
          />
        )
      case 'comprehension':
        return (
          <ComprehensionPreview
            question={question}
            response={response}
            onUpdate={(resp) => updateResponse(question.id, resp)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader className="text-center">
          {formData.headerImage && (
            <img 
              src={formData.headerImage || "/placeholder.svg"} 
              alt="Form header" 
              className="w-full max-h-64 object-cover rounded-lg mb-4"
            />
          )}
          <CardTitle className="text-3xl font-bold">{formData.title}</CardTitle>
          {formData.description && (
            <p className="text-slate-600 mt-2">{formData.description}</p>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {formData.questions.map((question, index) => (
          <Card key={question.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <CardTitle className="text-xl">{question.title}</CardTitle>
                  {question.description && (
                    <p className="text-slate-600 mt-1">{question.description}</p>
                  )}
                  {question.required && (
                    <span className="text-red-500 text-sm">* Required</span>
                  )}
                </div>
              </div>
              {question.image && (
                <img 
                  src={question.image || "/placeholder.svg"} 
                  alt="Question" 
                  className="max-h-48 rounded-lg object-cover mt-3"
                />
              )}
            </CardHeader>
            <CardContent>
              {renderQuestionPreview(question)}
            </CardContent>
          </Card>
        ))}

        {formData.questions.length > 0 && (
          <div className="text-center pt-6">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        )}

        {formData.questions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-500 text-lg">
                No questions in this form yet. Switch to the editor to add questions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
