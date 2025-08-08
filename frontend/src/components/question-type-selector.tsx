import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Grid3X3, FileText, BookOpen } from 'lucide-react'
import { Question } from "@/types/form"

interface QuestionTypeSelectorProps {
  onSelect: (type: Question['type']) => void
  onClose: () => void
}

export default function QuestionTypeSelector({ onSelect, onClose }: QuestionTypeSelectorProps) {
  const questionTypes = [
    {
      type: 'categorize' as const,
      title: 'Categorize',
      description: 'Drag and drop items into different categories',
      icon: Grid3X3,
      color: 'bg-purple-500'
    },
    {
      type: 'cloze' as const,
      title: 'Cloze (Fill in the Blanks)',
      description: 'Fill in missing words or phrases in a passage',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      type: 'comprehension' as const,
      title: 'Comprehension',
      description: 'Reading passage with multiple questions',
      icon: BookOpen,
      color: 'bg-blue-500'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Choose Question Type</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid gap-4">
          {questionTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card 
                key={type.type}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-slate-300"
                onClick={() => onSelect(type.type)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{type.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {type.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
