import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData, Question, FormResponse } from "@/types/form";
import CategorizePreview from "@/components/question-previews/CategorizePreview";
import ClozePreview from "@/components/question-previews/ClozePreview";
import ComprehensionPreview from "@/components/question-previews/ComprehensionPreview";
import axios from "axios";
interface FormPreviewProps {
  formData: FormData;
}

export default function FormPreview({ formData }: FormPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const updateResponse = (questionId: string, response: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: response,
    }));
  };

const handleSubmit = async () => {
  setIsSubmitting(true);
  setError(null); // Clear any previous errors

  try {
    if (!formData.id) {
      throw new Error("Form must be saved before submitting responses");
    }

    // Validate required questions
    const unansweredRequired = formData.questions
      .filter(q => q.required && !responses[q.id])
      .map(q => q.title);

    if (unansweredRequired.length > 0) {
      throw new Error(`Please answer all required questions: ${unansweredRequired.join(', ')}`);
    }

    const payload: FormResponse = {
      formId: formData.id,
      responses: Object.fromEntries(
        Object.entries(responses).map(([questionId, answer]) => [
          questionId.startsWith("q_") ? questionId.substring(2) : questionId,
          answer,
        ])
      ),
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/responses`,
      payload
    );
    console.log("response: ", response);

    alert("Form submitted successfully!");
    setResponses({});
  } catch (error: any) {
    console.error("Submission error:", error.response?.data || error.message);
    setError(error.response?.data?.message || error.message || "Submission failed");
  } finally {
    setIsSubmitting(false);
    setShowConfirm(false);
  }
};
  const renderQuestionPreview = (question: Question) => {
    const response = responses[question.id];

    switch (question.type) {
      case "categorize":
        return (
          <CategorizePreview
            question={question}
            response={response}
            onUpdate={(resp) => updateResponse(question.id, resp)}
          />
        );
      case "cloze":
        return (
          <ClozePreview
            question={question}
            response={response}
            onUpdate={(resp) => updateResponse(question.id, resp)}
          />
        );
      case "comprehension":
        return (
          <ComprehensionPreview
            question={question}
            response={response}
            onUpdate={(resp) => updateResponse(question.id, resp)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader className="text-center">
          {formData.headerImage && (
            <img
              src={formData.headerImage || "/placeholder.svg"}
              alt="Form header"
              className="w-full max-h-64 object-cover rounded-lg mb-4"
            />
          )}
          <CardTitle className="text-3xl font-bold">{formData.title}</CardTitle>
          {formData.description && (
            <p className="text-slate-600 mt-2">{formData.description}</p>
          )}
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {formData.questions.map((question, index) => (
          <Card key={question.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <CardTitle className="text-xl">{question.title}</CardTitle>
                  {question.description && (
                    <p className="text-slate-600 mt-1">
                      {question.description}
                    </p>
                  )}
                  {question.required && (
                    <span className="text-red-500 text-sm">* Required</span>
                  )}
                </div>
              </div>
              {question.image && (
                <img
                  src={question.image || "/placeholder.svg"}
                  alt="Question"
                  className="max-h-48 rounded-lg object-cover mt-3"
                />
              )}
            </CardHeader>
            <CardContent>{renderQuestionPreview(question)}</CardContent>
          </Card>
        ))}

        {formData.questions.length > 0 && (
          <div className="text-center pt-6">
            <Button
              onClick={() => setShowConfirm(true)}
              disabled={isSubmitting}
              size="lg"
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </div>
        )}

        {formData.questions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-500 text-lg">
                No questions in this form yet. Switch to the editor to add
                questions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      {showConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Are you sure you want to submit your responses?
      </h2>
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => setShowConfirm(false)}
          className="border-slate-300"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            setShowConfirm(false);
            handleSubmit();
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          Submit
        </Button>
      </div>
    </div>
  </div>
)}
{error && (
  <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-md">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">
          Submission Error
        </h3>
        <div className="mt-1 text-sm text-red-700">
          {error}
        </div>
      </div>
      <button
        onClick={() => setError(null)}
        className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
)}
    </div>
  );
}
