import requests
import json
import re

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:3b"  # or any other model you pulled


def generate_flashcards_from_text(text):
    prompt = f"""
    Read the following educational content and generate 5 Q&A flashcards in JSON format like:
    [{{
        "question": "What is X?",
        "answer": "X is ..."
    }}]
    
    Content:
    {text}
    """

    response = requests.post(OLLAMA_API_URL, json={
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    })

    try:
        result = response.json().get("response", "")
        print("Raw LLM response")
        print(result)
        print("===================")
        match = re.search(r"\[\s*\{.*?\}\s*\]", result, re.DOTALL)
        if match:
            json_array_str = match.group(0)
            return json.loads(json_array_str)
        else:
            print("❌ No JSON array found.")
            return []
    except Exception as e:
        print("Error parsing LLM response:", e)
        return []
