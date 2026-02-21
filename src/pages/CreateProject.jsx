import { useState } from "react";
import DecisionModal from "../components/DecisionModal";

const steps = [
    "Project Name",
    "Problem Statement",
    "Purpose",
    "Expected Output",
    "Target Audience",
    "Extra Add-ons",
];

export default function CreateProject({ onBack }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    const [formData, setFormData] = useState({
        projectName: "",
        problemStatement: "",
        purpose: "",
        expectedOutput: "",
        targetAudience: "",
        addons: "",
    });

    const requiredFields = [
        "projectName",
        "problemStatement",
        "purpose",
        "expectedOutput",
        "targetAudience",
    ];

    const isCurrentStepValid = () => {
        const key = Object.keys(formData)[currentStep];
        if (currentStep < 5) {
            return formData[key].trim() !== "";
        }
        return true;
    };

    const handleNext = () => {
        if (isCurrentStepValid()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

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
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        projectName: formData.projectName,
                        problemStatement: formData.problemStatement,
                        purpose: formData.purpose,
                        expectedOutput: formData.expectedOutput,
                        targetAudience: formData.targetAudience,
                        extraAddOns: formData.addons,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to analyze project");
            }

            const data = await response.json();

            // ✅ Correct parsing of webhook response
            const output = data?.[0]?.output;

            if (!output) {
                throw new Error("Invalid AI response format");
            }

            // ✅ Store FULL structured AI output
            setAiResult(output);

        } catch (err) {
            setSubmitError(err.message);
            setShowModal(false);
        } finally {
            setSubmitting(false);
            setAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative">

            {/* Back to Dashboard */}
            <button
                onClick={onBack}
                className="absolute top-6 left-6 text-gray-400 hover:text-white"
            >
                ← Back to Projects
            </button>

            {/* Step Progress Bar */}
            <div className="flex gap-2 mb-10">
                {steps.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-10 rounded-full transition ${index <= currentStep ? "bg-indigo-500" : "bg-gray-700"
                            }`}
                    />
                ))}
            </div>

            {/* Step Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    {steps[currentStep]}
                </h2>

                {currentStep === 0 && (
                    <Input
                        label="Project Name"
                        value={formData.projectName}
                        onChange={(v) => handleChange("projectName", v)}
                    />
                )}

                {currentStep === 1 && (
                    <Textarea
                        label="Problem Statement"
                        value={formData.problemStatement}
                        onChange={(v) => handleChange("problemStatement", v)}
                    />
                )}

                {currentStep === 2 && (
                    <Textarea
                        label="Purpose of the Problem"
                        value={formData.purpose}
                        onChange={(v) => handleChange("purpose", v)}
                    />
                )}

                {currentStep === 3 && (
                    <Textarea
                        label="Expected Output"
                        value={formData.expectedOutput}
                        onChange={(v) => handleChange("expectedOutput", v)}
                    />
                )}

                {currentStep === 4 && (
                    <Textarea
                        label="Targeted Audience"
                        value={formData.targetAudience}
                        onChange={(v) => handleChange("targetAudience", v)}
                    />
                )}

                {currentStep === 5 && (
                    <Textarea
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

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="px-4 py-2 text-sm rounded bg-gray-800 disabled:opacity-40"
                    >
                        Back
                    </button>

                    {currentStep < steps.length - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={!isCurrentStepValid()}
                            className="px-6 py-2 rounded bg-indigo-600 disabled:opacity-40"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={
                                submitting ||
                                !requiredFields.every(
                                    (key) => formData[key].trim() !== ""
                                )
                            }
                            className="px-6 py-2 rounded bg-green-600 disabled:opacity-40"
                        >
                            {submitting ? "Submitting..." : "Finish"}
                        </button>
                    )}
                </div>
            </div>
            <DecisionModal
                open={showModal}
                loading={aiLoading}
                aiOutput={aiResult}
                onProceed={() => {
                    setShowModal(false);
                    onBack();
                }}
                onReject={() => setShowModal(false)}
            />
        </div>


    );
}

/* ---------- Reusable Inputs ---------- */

function Input({ label, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">{label}</label>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-black border border-gray-700 rounded px-3 py-2"
                placeholder={label}
            />
        </div>
    );
}

function Textarea({ label, value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">{label}</label>
            <textarea
                rows={4}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-black border border-gray-700 rounded px-3 py-2 resize-none"
                placeholder={label}
            />
        </div>
    );
}