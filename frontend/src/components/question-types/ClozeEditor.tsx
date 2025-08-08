import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from "@/types/form"

interface ClozeEditorProps {
  question: Question
  onUpdate: (questionId: string, updates: Partial<Question>) => void
}

export default function ClozeEditor({ question, onUpdate }: ClozeEditorProps) {
  const options = question.options as { text: string, blanks: string[] }

  const updateText = (text: string) => {
    // Extract blanks from text (words wrapped in [brackets])
    const blankMatches = text.match(/\[([^\]]+)\]/g) || []
    const blanks = blankMatches.map(match => match.slice(1, -1))
    
    onUpdate(question.id, {
      options: { text, blanks }
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cloze Text</CardTitle>
          <p className="text-sm text-slate-600">
            Wrap words in [brackets] to create blanks. Example: "The [quick] brown fox jumps over the [lazy] dog."
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={options.text}
            onChange={(e) => updateText(e.target.value)}
            placeholder="Enter your text with [blanks] in brackets..."
            rows={6}
            className="font-mono"
          />
          
          {options.blanks.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Detected Blanks:</h4>
              <div className="flex flex-wrap gap-2">
                {options.blanks.map((blank, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {index + 1}. {blank}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
