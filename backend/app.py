from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from utils.extract_qna import generate_flashcards_from_text

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

@app.route('/api/generate', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    input_text = data.get('text', '')
    if not input_text.strip():
        return jsonify({"error": "Empty input"}), 400

    flashcards = generate_flashcards_from_text(input_text)
    return jsonify({"flashcards": flashcards})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
