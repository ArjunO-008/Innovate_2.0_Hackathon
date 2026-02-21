import Spinner from "./Spinner";
import { useState } from "react";

export default function DecisionModal({
  open,
  loading,
  aiOutput,
  onProceed,
  onReject,
}) {
  const [openSections, setOpenSections] = useState({});

  if (!open) return null;

  const toggle = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <ModalShell>
        <Spinner />
      </ModalShell>
    );
  }

  if (!aiOutput) return null;

  return (
    <ModalShell>
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-semibold text-center">
          Project Evaluation
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-300">

        {Object.entries(aiOutput).map(([key, value]) => {
          const title = prettify(key);

          // 🔹 Case 1: simple string
          if (typeof value === "string") {
            return (
              <Section key={key} title={title}>
                {value}
              </Section>
            );
          }

          // 🔹 Case 2: object (nested strings)
          if (typeof value === "object" && value !== null) {
            return (
              <Collapsible
                key={key}
                title={title}
                open={openSections[key]}
                onToggle={() => toggle(key)}
              >
                <div className="space-y-3">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div
                      key={subKey}
                      className="border border-gray-800 rounded p-4"
                    >
                      <h4 className="text-white font-medium mb-2">
                        {prettify(subKey)}
                      </h4>
                      <p className="whitespace-pre-wrap">
                        {String(subValue)}
                      </p>
                    </div>
                  ))}
                </div>
              </Collapsible>
            );
          }

          return null;
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 flex justify-end gap-4">
        <button
          onClick={onReject}
          className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700"
        >
          Reject
        </button>
        <button
          onClick={onProceed}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700"
        >
          Proceed
        </button>
      </div>
    </ModalShell>
  );
}

/* ---------- Helpers ---------- */

function ModalShell({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col">
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border border-gray-800 rounded p-4">
      <h3 className="text-white font-semibold mb-2">
        {title}
      </h3>
      <p className="whitespace-pre-wrap leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function Collapsible({ title, open, onToggle, children }) {
  return (
    <div className="border border-gray-800 rounded">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-800"
      >
        <span className="font-medium text-white">
          {title}
        </span>
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function prettify(str) {
  return str
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}