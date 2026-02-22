import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

export default function DecisionModal({
  open,
  loading,
  aiOutput,
  projectName,
  onReject,
}) {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [confirming, setConfirming]     = useState(false);
  const [confirmError, setConfirmError] = useState("");

  if (!open) return null;

  const toggle = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleProceed = async () => {
    setConfirming(true);
    setConfirmError("");
    try {
      const res = await fetch(
        "https://ieee.anjoostech.cfd/webhook-test/create/selection",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmation: true, projectName }),
        }
      );
      if (!res.ok) throw new Error("Confirmation failed");

      // Navigate to the project dashboard via router
      navigate(`/project/${encodeURIComponent(projectName)}`);
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setConfirming(false);
    }
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
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-center text-orange-500">
          Project Evaluation
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-700">
        {Object.entries(aiOutput).map(([key, value]) => {
          const title = prettify(key);

          if (typeof value === "string") {
            return <Section key={key} title={title}>{value}</Section>;
          }

          if (typeof value === "object" && value !== null) {
            return (
              <Collapsible
                key={key}
                title={title}
                open={openSections[key]}
                onToggle={() => toggle(key)}
              >
                {Object.entries(value).map(([subKey, subValue]) => (
                  <div
                    key={subKey}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <h4 className="font-semibold text-orange-500 mb-2">
                      {prettify(subKey)}
                    </h4>
                    <p className="whitespace-pre-wrap text-gray-700">
                      {String(subValue)}
                    </p>
                  </div>
                ))}
              </Collapsible>
            );
          }

          return null;
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        {confirmError && (
          <span className="text-red-500 text-sm">{confirmError}</span>
        )}

        <div className="flex gap-4 ml-auto">
          <button
            onClick={onReject}
            disabled={confirming}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
          >
            Reject
          </button>
          <button
            onClick={handleProceed}
            disabled={confirming}
            className="
              px-4 py-2 rounded-lg
              bg-orange-500 text-white font-semibold
              hover:bg-orange-600 shadow-md hover:shadow-lg
              disabled:opacity-50
            "
          >
            {confirming ? "Confirming..." : "Proceed"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ── Helpers ── */

function ModalShell({ children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-orange-500 mb-2">{title}</h3>
      <p className="whitespace-pre-wrap leading-relaxed text-gray-700">{children}</p>
    </div>
  );
}

function Collapsible({ title, open, onToggle, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition"
      >
        <span className="font-medium text-orange-500">{title}</span>
        <span className="text-orange-500 text-lg">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-gray-50">{children}</div>
      )}
    </div>
  );
}

function prettify(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
