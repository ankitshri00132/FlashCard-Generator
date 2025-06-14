import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const FlashcardApp = () => {
  const [inputText, setInputText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [pdfFileName, setPdfFileName] = useState("");

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfFileName(file.name); // ✅ Set file name immediately

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
      let text = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
      }

      setInputText(text);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const generateFlashcards = async () => {
    if (!inputText.trim()) return alert("Provide text or upload a PDF.");

    const sentences = inputText
      .split(/[.?!]\s+/)
      .filter((s) => s.length > 15)
      .slice(0, 5);

    const cards = sentences.map((s) => ({
      question: `What does the following refer to?`,
      answer: s.trim(),
    }));

    setFlashcards(cards);
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
              htmlFor="pdf-upload"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
            >
              Upload PDF
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handlePDFUpload}
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition"
          >
            Generate Flashcards
          </button>
        </div>

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
