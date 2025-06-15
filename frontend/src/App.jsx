import React, { useState } from "react";

const FlashcardApp = () => {
  const [inputText, setInputText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [pdfFileName, setPdfFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const exportToJSON = () => {
    const dataStr = JSON.stringify(flashcards, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;
    const exportFileDefaultName = "flashcards.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const exportToCSV = () => {
    const headers = ["Question", "Answer"];
    const csvContent = [
      headers.join(","),
      ...flashcards.map(
        (card) =>
          `"${card.question.replace(/"/g, '""')}","${card.answer.replace(
            /"/g,
            '""'
          )}"`
      ),
    ].join("\n");

    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(
      csvContent
    )}`;
    const exportFileDefaultName = "flashcards.csv";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setError("");
    setPdfFileName(file.name);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process file");
      }

      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
        setInputText(""); // Clear text input when file is processed
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setError(error.message);
      console.error("File upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFlashcards = async () => {
    if (!inputText.trim()) return alert("Provide text or upload a file.");

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate flashcards");
      }

      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">
          Flashcard Generator
        </h1>

        <div className="mb-4">
          <textarea
            className="w-full h-40 p-4 m-2 border border-gray-300 rounded-lg resize-none focus:ring-0"
            placeholder="Paste or upload content..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
            >
              Upload File
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            {pdfFileName && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {pdfFileName}
              </p>
            )}
          </div>

          <button
            onClick={generateFlashcards}
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : "Generate Flashcards"}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Export Buttons */}
        {flashcards.length > 0 && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={exportToJSON}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition"
            >
              Export as JSON
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition"
            >
              Export as CSV
            </button>
          </div>
        )}

        {/* Flashcard Output */}
        {flashcards.length > 0 && (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card, i) => (
              <div
                key={i}
                className="bg-blue-50 border border-blue-300 p-4 rounded-xl shadow"
              >
                <h2 className="font-semibold text-blue-800 mb-2">
                  Q: {card.question}
                </h2>
                <p className="text-gray-700">A: {card.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardApp;
