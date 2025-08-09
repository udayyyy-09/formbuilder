import { useState, useEffect } from "react"

// Mock Input component since @/components/ui/input isn't available


interface Question {
  options: {
    text: string
    blanks: string[]
  }
}

interface ClozePreviewProps {
  question: Question
  response: any
  onUpdate: (response: any) => void
}

export default function ClozePreview({ 
  question = {
    options: {
      text: "The [cat] sat on the [mat] and looked at the [bird] in the tree.",
      blanks: ["cat", "mat", "bird"]
    }
  }, 
  response, 
  onUpdate = () => {} 
}: ClozePreviewProps) {
  const options = question.options
  
  // Extract blanks from the text automatically
  const extractBlanksFromText = (text: string) => {
    const matches = text.match(/\[([^\]]+)\]/g)
    return matches ? matches.map(match => match.slice(1, -1)) : []
  }
  
  const blanksFromText = extractBlanksFromText(options.text)
  const availableWords = options.blanks?.length > 0 ? options.blanks : blanksFromText
  
  const [answers, setAnswers] = useState<(string | null)[]>(
    response || new Array(blanksFromText.length).fill(null)
  )
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [draggedWord, setDraggedWord] = useState<string | null>(null)

  useEffect(() => {
    // Update used words set when answers change
    const used = new Set(answers.filter(answer => answer !== null))
    setUsedWords(used)
    
    // Format response as an array of answer strings
    onUpdate(answers)
  }, [answers, onUpdate])

  const handleDragStart = (e: React.DragEvent, word: string) => {
    setDraggedWord(word)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, blankIndex: number) => {
    e.preventDefault()
    
    if (draggedWord) {
      const newAnswers = [...answers]
      
      // If there's already an answer in this blank, return it to available words
      const previousAnswer = newAnswers[blankIndex]
      
      // Set the new answer
      newAnswers[blankIndex] = draggedWord
      setAnswers(newAnswers)
      
      setDraggedWord(null)
    }
  }

  const handleRemoveAnswer = (blankIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[blankIndex] = null
    setAnswers(newAnswers)
  }

  // Replace [blanks] with drop zones
  const renderTextWithDropZones = () => {
    let text = options.text
    let blankIndex = 0
    
    // Replace each [word] with a drop zone
    const parts = text.split(/(\[[^\]]+\])/)
    
    return parts.map((part, index) => {
      if (part.match(/\[[^\]]+\]/)) {
        const currentBlankIndex = blankIndex++
        const currentAnswer = answers[currentBlankIndex]
        
        return (
          <span
            key={index}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, currentBlankIndex)}
            className={`inline-block min-w-24 mx-1 px-3 py-2 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all ${
              currentAnswer 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
            }`}
            style={{ minHeight: '40px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {currentAnswer ? (
              <span 
                className="bg-white border border-green-300 rounded px-2 py-1 text-sm cursor-pointer hover:bg-red-50"
                onClick={() => handleRemoveAnswer(currentBlankIndex)}
                title="Click to remove"
              >
                {currentAnswer} ✕
              </span>
            ) : (
              <span className="text-gray-400 text-sm">Drop here</span>
            )}
          </span>
        )
      }
      return <span key={index} className="text-lg">{part}</span>
    })
  }

  const getAvailableWords = () => {
    return availableWords.filter(word => !usedWords.has(word))
  }

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Fill in the Blanks</h2>
      
      {/* Text with drop zones */}
      <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-300">
        <div className="text-lg leading-relaxed">
          {renderTextWithDropZones()}
        </div>
      </div>
      
      {/* Word bank */}
      <div className="bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300">
        <h3 className="font-semibold mb-3 text-blue-800">Word Bank</h3>
        <div className="flex flex-wrap gap-2">
          {getAvailableWords().length > 0 ? (
            getAvailableWords().map((word, index) => (
              <div
                key={`${word}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, word)}
                className="bg-white border border-blue-300 rounded-lg px-4 py-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-all hover:bg-blue-100"
              >
                {word}
              </div>
            ))
          ) : (
            <p className="text-blue-600 italic">All words have been used!</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Drag words from the word bank to fill in the blanks</li>
          <li>Click on a placed word to remove it and return it to the word bank</li>
          <li>Drop zones will highlight when you drag over them</li>
        </ul>
      </div>

     
    </div>
  )
}