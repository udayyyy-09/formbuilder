import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormEditor from "@/components/FormEditor";
import FormPreview from "@/components/FormPreview";
import { FormData } from "@/types/form";
import axios from "axios";
export default function App() {
  const [activeTab, setActiveTab] = useState("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "Untitled Form",
    description: "",
    headerImage: "",
    questions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleSaveForm = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forms`, formData,{
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert("Form saved successfully!");
    } catch (error) {
      alert("Error saving form");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Form Builder</h1>
            <p className="text-slate-600 mt-2">
              Create and customize your forms with drag-and-drop
            </p>
          </div>
          <Button
            onClick={handleSaveForm}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSaving ? "Saving..." : "Save Form"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="editor" className="text-lg py-3">
              Form Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-lg py-3">
              Preview & Fill
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <FormEditor formData={formData} setFormData={setFormData} />
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <FormPreview formData={formData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
