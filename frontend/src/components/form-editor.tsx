import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ImageIcon } from 'lucide-react'
import { FormData, Question } from "@/types/form"
import SortableQuestion from "@/components/sortable-question"
import QuestionTypeSelector from "@/components/question-type-selector"

interface FormEditorProps {
  formData: FormData
  setFormData: (data: FormData) => void
}

export default function FormEditor({ formData, setFormData }: FormEditorProps) {
  const [showQuestionTypes, setShowQuestionTypes] = useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = formData.questions.findIndex((q) => q.id === active.id)
      const newIndex = formData.questions.findIndex((q) => q.id === over.id)

      setFormData({
        ...formData,
        questions: arrayMove(formData.questions, oldIndex, newIndex)
      })
    }
  }

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: `New ${type} Question`,
      description: "",
      required: false,
      image: "",
      options: type === 'categorize' ? { categories: [], items: [] } : 
               type === 'cloze' ? { text: "", blanks: [] } :
               type === 'comprehension' ? { passage: "", questions: [] } : {}
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    })
    setShowQuestionTypes(false)
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    })
  }

  const deleteQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== questionId)
    })
  }

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          headerImage: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Form Header Settings */}
      <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Form Header
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Form Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter form title"
              className="text-lg font-semibold"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter form description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Header Image</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
              {formData.headerImage ? (
                <div className="space-y-2">
                  <img 
                    src={formData.headerImage || "/placeholder.svg"} 
                    alt="Header" 
                    className="max-h-48 mx-auto rounded-lg object-cover"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFormData({ ...formData, headerImage: "" })}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <ImageIcon className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                  <p className="text-slate-600 mb-2">Upload header image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderImageUpload}
                    className="hidden"
                    id="header-image"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="header-image" className="cursor-pointer">
                      Choose Image
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
          <Button 
            onClick={() => setShowQuestionTypes(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {formData.questions.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-300 p-12 text-center">
            <div className="text-slate-500">
              <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No questions yet</p>
              <p className="text-sm">Click "Add Question" to get started</p>
            </div>
          </Card>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formData.questions.map(q => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <SortableQuestion
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Question Type Selector Modal */}
      {showQuestionTypes && (
        <QuestionTypeSelector
          onSelect={addQuestion}
          onClose={() => setShowQuestionTypes(false)}
        />
      )}
    </div>
  )
}
