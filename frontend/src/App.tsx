import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FiSave, FiEye, FiEdit2, FiAlertCircle, FiX, FiCheck } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import FormEditor from "@/components/FormEditor";
import FormPreview from "@/components/FormPreview";
import { FormData } from "@/types/form";
import axios from "axios";
import { Landing } from './components/Land';
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [activeTab, setActiveTab] = useState("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
  setError(null);
  setSuccessMessage(null);
  
  try {
    const resp = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/forms`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setFormData(prev => ({
      ...prev,
      id: resp.data._id,
    }));

    setSuccessMessage("Form saved successfully!");
  } catch (error: any) {
    console.error("Error saving form:", error);
    setError(error.response?.data?.message || "Error saving form");
  } finally {
    setIsSaving(false);
    setShowConfirm(false);
  }
};

  return (
    <>
      {!showBuilder ? (
        <Landing onStart={() => setShowBuilder(true)} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4 py-8">
            {/* Header with animated gradient */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white"
            >
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold">FormCraft Pro</h1>
                <p className="mt-1 sm:mt-2 opacity-90 text-sm sm:text-base">
                  Build beautiful forms with drag-and-drop ease
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={isSaving}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-medium gap-2"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Form
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>

            {/* Main content with smooth transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1 rounded-lg h-12">
                    <TabsTrigger 
                      value="editor" 
                      className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Editor</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview" 
                      className="py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>Preview</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="editor">
                    <Card className="p-4 sm:p-6 shadow-sm border-0 rounded-xl bg-white">
                      <FormEditor formData={formData} setFormData={setFormData} />
                    </Card>
                  </TabsContent>

                  <TabsContent value="preview">
                    <Card className="p-4 sm:p-6 shadow-sm border-0 rounded-xl bg-white">
                      <FormPreview formData={formData} />
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full border border-slate-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mt-1 bg-blue-100 p-2 rounded-full">
                      <FiAlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Save your form</h3>
                      <p className="text-slate-600 mt-1 text-sm">
                        Are you sure you want to save this form? You can edit it later.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowConfirm(false)}
                      className="border-slate-300 hover:bg-slate-100 gap-2"
                    >
                     
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveForm}
                      className="bg-blue-600 hover:bg-blue-700 gap-2"
                      disabled={isSaving}
                    >
                     {isSaving && <FaSpinner className="animate-spin" />}
                      Confirm Save
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
  {error && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-md z-50"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-1 text-sm text-red-700">{error}</div>
        </div>
        <button
          onClick={() => setError(null)}
          className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

<AnimatePresence>
  {successMessage && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg max-w-md z-50"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FiCheck className="h-5 w-5 text-green-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">Success</h3>
          <div className="mt-1 text-sm text-green-700">{successMessage}</div>
        </div>
        <button
          onClick={() => setSuccessMessage(null)}
          className="ml-auto flex-shrink-0 text-green-500 hover:text-green-700"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      )}
    </>
  );
}