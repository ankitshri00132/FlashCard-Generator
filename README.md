# 🧠 Flashcard Generator using LLMs

A full-stack web application that generates **question-answer flashcards** from educational text or PDF files using **local LLMs via Ollama**.

## 🚀 Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Flask (Python)
- **LLM Integration:** Ollama (LLaMA3.2:3b)
- **PDF Extraction:** PyPDF2

---

## ✨ Features

- Upload **text** or **PDF** files
- Extract and parse content from PDF using `PyPDF2`
- Generate Q&A flashcards using a locally running LLM (via Ollama)
- Clean and responsive UI using Tailwind CSS
- Fully local processing (no OpenAI or cloud API required)
- Export files in the format of .json or .csv

---

## 🛠️ Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/your-username/FlashCard-Generator.git
cd flashcard-generator
```
### 🔹 2. Backend Setup (Flask + Ollama)
a. Create virtual environment and install dependencies
```bash
cd backend
pip install flask flask-cors PyPDF2 requests
```
b. Install and Run Ollama
- Download from: https://ollama.com
- Start the model
```bash
ollama run llama3.2:3b
```
c. Start Flask Server
```bash
python app.py
```
### 🔹 3. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
### Usage 
- Open the application is opened in your web browser
- Choose your input method (.pdf / .txt / raw text)
- Click generate flashcard (not required for file upload)

### Sample Output
- By giving raw input :

![image](https://github.com/user-attachments/assets/fd731dd7-b8a6-4598-8486-ff0ab7e05003)

- By uploading a pdf file :
  ![image](https://github.com/user-attachments/assets/e84c40a7-ee3a-4be3-9bcd-51f6090f148c)


