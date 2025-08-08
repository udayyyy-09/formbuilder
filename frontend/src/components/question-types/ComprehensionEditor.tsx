import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'
import { Question } from "@/types/form"

interface ComprehensionEditorProps {
  question: Question
  onUpdate: (questionId: string, updates: Partial<Question>) => void
}

export default function ComprehensionEditor({ question, onUpdate }: ComprehensionEditorProps) {
  const options = question.options as { passage: string, questions: Array<{ question: string, options: string[], correctAnswer: number }> }

  const updatePassage = (passage: string) => {
    onUpdate(question.id, {
      options: { ...options, passage }
    })
  }

  const addQuestion = () => {
    onUpdate(question.id, {
      options: {
        ...options,
        questions: [...options.questions, {
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        }]
      }
    })
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const newQuestions = [...options.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    onUpdate(question.id, {
      options: { ...options, questions: newQuestions }
    })
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...options.questions]
    const newOptions = [...newQuestions[questionIndex].options]
    newOptions[optionIndex] = value
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions }
    onUpdate(question.id, {
      options: { ...options, questions: newQuestions }
    })
  }

  const removeQuestion = (index: number) => {
    onUpdate(question.id, {
      options: {
        ...options,
        questions: options.questions.filter((_, i) => i !== index)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Reading Passage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Reading Passage</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={options.passage}
            onChange={(e) => updatePassage(e.target.value)}
            placeholder="Enter the reading passage here..."
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Comprehension Questions</CardTitle>
            <Button onClick={addQuestion} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.questions.map((q, index) => (
            <Card key={index} className="border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <Button
                    onClick={() => removeQuestion(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={q.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  placeholder="Enter question..."
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Answer Options:</label>
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${index}`}
                        checked={q.correctAnswer === optionIndex}
                        onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                        className="text-green-600"
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">Select the radio button next to the correct answer</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {options.questions.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No questions added yet. Click "Add Question" to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
