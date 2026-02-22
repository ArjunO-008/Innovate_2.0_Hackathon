import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DecisionModal from "../components/DecisionModal";

const steps = [
  "Project Name",
  "Problem Statement",
  "Purpose",
  "Expected Output",
  "Target Audience",
  "Extra Add-ons",
];

const INITIAL_FORM = {
  projectName: "",
  problemStatement: "",
  purpose: "",
  expectedOutput: "",
  targetAudience: "",
  addons: "",
};

const requiredFields = [
  "projectName",
  "problemStatement",
  "purpose",
  "expectedOutput",
  "targetAudience",
];

export default function CreateProject() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiResult, setAiResult]       = useState(null);
  const [formData, setFormData]       = useState(INITIAL_FORM);

  /* ── Helpers ── */
  const isCurrentStepValid = () => {
    const key = Object.keys(formData)[currentStep];
    if (currentStep < 5) return formData[key].trim() !== "";
    return true;
  };

  const handleNext = () => {
    if (isCurrentStepValid()) setCurrentStep((p) => p + 1);
  };

  const handleBackStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 0));
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    setShowModal(true);
    setAiLoading(true);

    try {
      const response = await fetch(
        "https://ieee.anjoostech.cfd/webhook-test/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName:      formData.projectName,
            problemStatement: formData.problemStatement,
            purpose:          formData.purpose,
            expectedOutput:   formData.expectedOutput,
            targetAudience:   formData.targetAudience,
            extraAddOns:      formData.addons,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to analyze project");

      const data   = await response.json();
      const output = data?.[0]?.output;
      if (!output) throw new Error("Invalid AI response format");

      setAiResult(output);
    } catch (err) {
      setSubmitError(err.message);
      setShowModal(false);
    } finally {
      setSubmitting(false);
      setAiLoading(false);
    }
  };

  /* ── UI ── */
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 relative">

      {/* Back */}
      <Link
        to="/dashboard"
        className="absolute top-6 left-6 text-sm text-gray-500 hover:text-orange-500 transition"
      >
        ← Back to Projects
      </Link>

      <div className="w-full max-w-xl">

        {/* Step Indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-10 rounded-full transition ${
                index <= currentStep ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-orange-500 mb-6">
            {steps[currentStep]}
          </h2>

          {currentStep === 0 && (
            <FormInput
              label="Project Name"
              value={formData.projectName}
              onChange={(v) => handleChange("projectName", v)}
            />
          )}
          {currentStep === 1 && (
            <FormTextarea
              label="Problem Statement"
              value={formData.problemStatement}
              onChange={(v) => handleChange("problemStatement", v)}
            />
          )}
          {currentStep === 2 && (
            <FormTextarea
              label="Purpose of the Problem"
              value={formData.purpose}
              onChange={(v) => handleChange("purpose", v)}
            />
          )}
          {currentStep === 3 && (
            <FormTextarea
              label="Expected Output"
              value={formData.expectedOutput}
              onChange={(v) => handleChange("expectedOutput", v)}
            />
          )}
          {currentStep === 4 && (
            <FormTextarea
              label="Target Audience"
              value={formData.targetAudience}
              onChange={(v) => handleChange("targetAudience", v)}
            />
          )}
          {currentStep === 5 && (
            <FormTextarea
              label="Extra Add-ons (Optional)"
              value={formData.addons}
              onChange={(v) => handleChange("addons", v)}
            />
          )}

          {submitError && (
            <p className="text-red-500 text-sm text-center mt-4">
              {submitError}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBackStep}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
            >
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
                className="px-6 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-40"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  !requiredFields.every((key) => formData[key].trim() !== "")
                }
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Finish"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Modal — navigation to /project/:name handled inside DecisionModal */}
      <DecisionModal
        open={showModal}
        loading={aiLoading}
        aiOutput={aiResult}
        projectName={formData.projectName}
        onReject={() => setShowModal(false)}
      />
    </div>
  );
}

/* ── Input Helpers ── */

function FormInput({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

function FormTextarea({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="px-4 py-2 rounded-lg resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
