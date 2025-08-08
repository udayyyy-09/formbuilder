import { useState } from "react"
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Question } from "@/types/form"

interface CategorizePreviewProps {
  question: Question
  response: any
  onUpdate: (response: any) => void
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

export default function CategorizePreview({ question, response, onUpdate }: CategorizePreviewProps) {
  const options = question.options as { categories: string[], items: string[] }
  const [categorizedItems, setCategorizedItems] = useState<Record<string, string[]>>(
  response || {
    ...options.categories.reduce((acc, cat) => ({ ...acc, [cat]: [] }), {}),
    uncategorized: [...options.items],
  }
)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) return

    const itemId = active.id as string
    const targetCategory = over.id as string

    // Find current category of the item
    let currentCategory = ''
    for (const [category, items] of Object.entries(categorizedItems)) {
      if (items.includes(itemId)) {
        currentCategory = category
        break
      }
    }

    if (currentCategory === targetCategory) return

    // Move item to new category
    const newCategorizedItems = {
      ...categorizedItems,
      [currentCategory]: categorizedItems[currentCategory].filter(item => item !== itemId),
      [targetCategory]: [...categorizedItems[targetCategory], itemId]
    }

    setCategorizedItems(newCategorizedItems)
    onUpdate(newCategorizedItems)
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        {/* Uncategorized Items */}
        <Card className="bg-slate-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Items to Categorize</CardTitle>
          </CardHeader>
          <CardContent>
            <SortableContext items={categorizedItems.uncategorized} strategy={verticalListSortingStrategy}>
              <div 
                className="min-h-[100px] border-2 border-dashed border-slate-300 rounded-lg p-4 space-y-2"
                id="uncategorized"
              >
                {categorizedItems.uncategorized.map((item) => (
                  <DraggableItem key={item} id={item}>
                    {item}
                  </DraggableItem>
                ))}
                {categorizedItems.uncategorized.length === 0 && (
                  <p className="text-slate-500 text-center py-8">All items have been categorized!</p>
                )}
              </div>
            </SortableContext>
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
                <SortableContext items={categorizedItems[category]} strategy={verticalListSortingStrategy}>
                  <div 
                    className="min-h-[120px] border-2 border-dashed border-blue-300 rounded-lg p-4 space-y-2 bg-blue-50"
                    id={category}
                  >
                    {categorizedItems[category].map((item) => (
                      <DraggableItem key={item} id={item}>
                        {item}
                      </DraggableItem>
                    ))}
                    {categorizedItems[category].length === 0 && (
                      <p className="text-blue-500 text-center py-8 text-sm">
                        Drop items here
                      </p>
                    )}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DndContext>
  )
}
