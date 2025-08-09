import { useState } from "react"
import { DndContext, closestCenter, DragEndEvent, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Mock UI components since they're not available
interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`border rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }: CardProps) => (
  <h3 className={`font-semibold ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
)

interface CategorizePreviewProps {
  question: {
    options: {
      categories: string[]
      items: { text: string; category: string }[]
    }
  }
  response?: any
  onUpdate: (response: any) => void
}

interface DroppableProps {
  id: string
  children: React.ReactNode
  className?: string
}

interface DraggableItemProps {
  id: string
  children: React.ReactNode
}

function DraggableItem({ id, children }: DraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-slate-300 rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
    >
      {children}
    </div>
  )
}

function Droppable({ id, children, className }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  const style = {
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
    >
      {children}
    </div>
  )
}

type CategoryRecord = Record<string | 'uncategorized', string[]>

export default function CategorizePreview({ 
  question = {
    options: {
      categories: ["Fruits", "Vegetables"],
      items: [
        { text: "Apple", category: "uncategorized" },
        { text: "Carrot", category: "uncategorized" },
        { text: "Banana", category: "uncategorized" },
        { text: "Broccoli", category: "uncategorized" }
      ]
    }
  }, 
  response, 
  onUpdate = () => {} 
}: CategorizePreviewProps) {
  const options = question.options
  
  const [categorizedItems, setCategorizedItems] = useState<CategoryRecord>(() => {
    if (response) return response as CategoryRecord
    
    // Initialize with all items in uncategorized
    return {
      uncategorized: options.items.map(item => item.text),
      ...options.categories.reduce((acc, cat) => ({ 
        ...acc, 
        [cat]: [] 
      }), {})
    }
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const itemText = active.id as string
    const targetCategory = over.id as string

    // Find source category
    const sourceCategory = Object.keys(categorizedItems).find(category => 
      categorizedItems[category].includes(itemText)
    ) || 'uncategorized'

    if (sourceCategory === targetCategory) return

    // Update state
    const newCategorizedItems = {
      ...categorizedItems,
      [sourceCategory]: categorizedItems[sourceCategory].filter(text => text !== itemText),
      [targetCategory]: [...categorizedItems[targetCategory], itemText]
    }

    console.log('Updated categories:', newCategorizedItems) // Debug log
    setCategorizedItems(newCategorizedItems)
    onUpdate(newCategorizedItems)
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Categorize Items</h2>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="space-y-6">
          {/* Uncategorized Items */}
          <Card className="bg-slate-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Items to Categorize</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable 
                id="uncategorized"
                className="min-h-[120px] border-2 border-dashed border-slate-300 rounded-lg p-4 space-y-2 transition-colors"
              >
                <SortableContext 
                  items={categorizedItems.uncategorized || []} 
                  strategy={verticalListSortingStrategy}
                >
                  {categorizedItems.uncategorized && categorizedItems.uncategorized.length > 0 ? (
                    categorizedItems.uncategorized.map((itemText) => (
                      <DraggableItem key={itemText} id={itemText}>
                        {itemText}
                      </DraggableItem>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-8">All items categorized!</p>
                  )}
                </SortableContext>
              </Droppable>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="grid gap-4 md:grid-cols-2">
            {options.categories.map((category) => (
              <Card key={category} className="border-2 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable 
                    id={category}
                    className="min-h-[120px] border-2 border-dashed border-blue-300 rounded-lg p-4 space-y-2 bg-blue-50 transition-colors"
                  >
                    <SortableContext 
                      items={categorizedItems[category] || []} 
                      strategy={verticalListSortingStrategy}
                    >
                      {categorizedItems[category] && categorizedItems[category].length > 0 ? (
                        categorizedItems[category].map((itemText) => (
                          <DraggableItem key={itemText} id={itemText}>
                            {itemText}
                          </DraggableItem>
                        ))
                      ) : (
                        <p className="text-blue-500 text-center py-8 text-sm">
                          Drop items here
                        </p>
                      )}
                    </SortableContext>
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Debug Info */}

        </div>
      </DndContext>
    </div>
  )
}