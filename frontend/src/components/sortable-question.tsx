"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { GripVertical, Trash2, ImageIcon } from 'lucide-react'
import { Question } from "@/types/form"
import CategorizeEditor from "@/components/categorize-editor"
import ClozeEditor from "@/components/cloze-editor"
import ComprehensionEditor from "@/components/comprehension-editor"

interface SortableQuestionProps {
  question: Question
  index: number
  onUpdate: (questionId: string, updates: Partial<Question>) => void
  onDelete: (questionId: string) => void
}

export default function SortableQuestion({ question, index, onUpdate, onDelete }: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onUpdate(question.id, { image: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const renderQuestionTypeEditor = () => {
    switch (question.type) {
      case 'categorize':
        return <CategorizeEditor question={question} onUpdate={onUpdate} />
      case 'cloze':
        return <ClozeEditor question={question} onUpdate={onUpdate} />
      case 'comprehension':
        return <ComprehensionEditor question={question} onUpdate={onUpdate} />
      default:
        return null
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-grab active:cursor-grabbing p-1"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4 text-slate-400" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {question.type.toUpperCase()}
              </span>
              <span className="text-sm text-slate-500">Question {index + 1}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Question Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Question Title</label>
          <Input
            value={question.title}
            onChange={(e) => onUpdate(question.id, { title: e.target.value })}
            placeholder="Enter question title"
            className="font-medium"
          />
        </div>

        {/* Question Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description (Optional)</label>
          <Textarea
            value={question.description}
            onChange={(e) => onUpdate(question.id, { description: e.target.value })}
            placeholder="Add additional context or instructions"
            rows={2}
          />
        </div>

        {/* Question Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Question Image (Optional)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
            {question.image ? (
              <div className="space-y-2">
                <img 
                  src={question.image || "/placeholder.svg"} 
                  alt="Question" 
                  className="max-h-32 mx-auto rounded object-cover"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdate(question.id, { image: "" })}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div>
                <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-600 mb-2">Add an image to this question</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`question-image-${question.id}`}
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor={`question-image-${question.id}`} className="cursor-pointer">
                    Choose Image
                  </label>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Question Type Specific Editor */}
        {renderQuestionTypeEditor()}

        {/* Required Toggle */}
        <div className="flex items-center justify-between pt-4 border-t">
          <label className="text-sm font-medium">Required Question</label>
          <Switch
            checked={question.required}
            onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
