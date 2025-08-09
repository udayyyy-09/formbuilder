import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Question } from "@/types/form";

interface CategorizeEditorProps {
  question: Question;
  onUpdate: (questionId: string, updates: Partial<Question>) => void;
}

export default function CategorizeEditor({
  question,
  onUpdate,
}: CategorizeEditorProps) {
  const options = question.options as {
    categories: string[];
    items: { text: string; category: string }[];
  };

  const addCategory = () => {
    onUpdate(question.id, {
      options: {
        ...options,
        categories: [
          ...options.categories,
          `Category ${options.categories.length + 1}`,
        ],
      },
    });
  };

  const updateCategory = (index: number, value: string) => {
    const newCategories = [...options.categories];
    newCategories[index] = value;
    onUpdate(question.id, {
      options: { ...options, categories: newCategories },
    });
  };

  const removeCategory = (index: number) => {
    onUpdate(question.id, {
      options: {
        ...options,
        categories: options.categories.filter((_, i) => i !== index),
      },
    });
  };

  const addItem = () => {
    // Make sure we select the first category if available, otherwise use "Uncategorized"
    const defaultCategory =
      options.categories.length > 0 ? options.categories[0] : "Uncategorized";

    onUpdate(question.id, {
      options: {
        ...options,
        items: [
          ...options.items,
          {
            text: "",
            category: defaultCategory,
          },
        ],
      },
    });
  };

  const updateItem = (
    index: number,
    updates: Partial<{ text: string; category: string }>
  ) => {
    const newItems = [...options.items];
    newItems[index] = {
      ...newItems[index],
      ...updates,
    };
    onUpdate(question.id, {
      options: { ...options, items: newItems },
    });
  };

  const removeItem = (index: number) => {
    onUpdate(question.id, {
      options: {
        ...options,
        items: options.items.filter((_, i) => i !== index),
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Categories</CardTitle>
            <Button onClick={addCategory} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {options.categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={category}
                onChange={(e) => updateCategory(index, e.target.value)}
                placeholder={`Category ${index + 1}`}
              />
              <Button
                onClick={() => removeCategory(index)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {options.categories.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No categories added yet. Click "Add Category" to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Items to Categorize */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Items to Categorize</CardTitle>
            <Button onClick={addItem} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {options.items.map((item, index) => (
  <div key={index} className="flex items-center gap-2">
    <Input
      value={item.text}
      onChange={(e) => updateItem(index, { text: e.target.value })}
      placeholder={`Item ${index + 1}`}
    />
    <select 
      value={item.category}
      onChange={(e) => updateItem(index, { category: e.target.value })}
      className="border rounded p-2"
    >
      {options.categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
    <Button
      onClick={() => removeItem(index)}
      size="sm"
      variant="ghost"
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
))}
          {options.items.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              No items added yet. Click "Add Item" to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
