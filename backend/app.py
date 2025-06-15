from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from utils.extract_qna import generate_flashcards_from_text
import PyPDF2
import io

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend


def extract_text_from_file(file):
    if file.filename.endswith('.pdf'):
        # Handle PDF file
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    elif file.filename.endswith('.txt'):
        # Handle TXT file
        return file.read().decode('utf-8')
    else:
        raise ValueError(
            "Unsupported file format. Please upload a PDF or TXT file.")


@app.route('/api/generate', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    input_text = data.get('text', '')
    if not input_text.strip():
        return jsonify({"error": "Empty input"}), 400

    flashcards = generate_flashcards_from_text(input_text)
    return jsonify({"flashcards": flashcards})


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        text = extract_text_from_file(file)
        if not text.strip():
            return jsonify({"error": "Could not extract text from file"}), 400

        flashcards = generate_flashcards_from_text(text)
        return jsonify({"flashcards": flashcards})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Error processing file"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
