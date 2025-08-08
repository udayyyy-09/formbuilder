import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Question } from "@/types/form"

interface ComprehensionPreviewProps {
  question: Question
  response: any
  onUpdate: (response: any) => void
}

export default function ComprehensionPreview({ question, response, onUpdate }: ComprehensionPreviewProps) {
  const options = question.options as { passage: string, questions: Array<{ question: string, options: string[], correctAnswer: number }> }
  const [answers, setAnswers] = useState<number[]>(response || new Array(options.questions.length).fill(-1))

  useEffect(() => {
    onUpdate(answers)
  }, [answers])

  const updateAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  return (
    <div className="space-y-6">
      {/* Reading Passage */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-lg">Reading Passage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {options.passage}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Questions</h3>
        {options.questions.map((q, questionIndex) => (
          <Card key={questionIndex} className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {questionIndex + 1}. {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[questionIndex]?.toString() || ""}
                onValueChange={(value) => updateAnswer(questionIndex, parseInt(value))}
              >
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={optionIndex.toString()} 
                      id={`q${questionIndex}-o${optionIndex}`} 
                    />
                    <Label 
                      htmlFor={`q${questionIndex}-o${optionIndex}`}
                      className="cursor-pointer flex-1"
                    >
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
