import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Question } from "@/types/form"

interface ClozePreviewProps {
  question: Question
  response: any
  onUpdate: (response: any) => void
}

export default function ClozePreview({ question, response, onUpdate }: ClozePreviewProps) {
  const options = question.options as { text: string, blanks: string[] }
  const [answers, setAnswers] = useState<string[]>(response || new Array(options.blanks.length).fill(''))

  useEffect(() => {
    onUpdate(answers)
  }, [answers])

  const updateAnswer = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  // Replace [blanks] with input fields
  const renderTextWithBlanks = () => {
    let text = options.text
    let blankIndex = 0
    
    // Replace each [word] with an input field
    const parts = text.split(/(\[[^\]]+\])/)
    
    return parts.map((part, index) => {
      if (part.match(/\[[^\]]+\]/)) {
        const inputIndex = blankIndex++
        return (
          <Input
            key={index}
            value={answers[inputIndex] || ''}
            onChange={(e) => updateAnswer(inputIndex, e.target.value)}
            className="inline-block w-32 mx-1 text-center border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:border-blue-500"
            placeholder={`Blank ${inputIndex + 1}`}
          />
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-300">
        <div className="text-lg leading-relaxed">
          {renderTextWithBlanks()}
        </div>
      </div>
      
      {options.blanks.length > 0 && (
        <div className="text-sm text-slate-600">
          <p className="font-medium mb-2">Fill in the blanks:</p>
          <div className="grid grid-cols-2 gap-2">
            {options.blanks.map((blank, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-mono text-xs bg-slate-200 px-2 py-1 rounded">
                  {index + 1}
                </span>
                <span className="text-slate-500">Expected: {blank}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
