from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
import os
import PyPDF2
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv
import speech_recognition as sr
from gtts import gTTS
from groq import Groq
import time

app = Flask(__name__)

# Load environment variables
load_dotenv()

# Initialize the language model
def init_llm():
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY not found. Please set it in your .env file.")
    return ChatGroq(groq_api_key=groq_api_key, model_name="llama-3.1-70b-versatile")

llm = init_llm()
groq_client = Groq()

# Create a conversation memory
memory = ConversationBufferMemory(return_messages=True)

# Create a conversation chain
conversation = ConversationChain(llm=llm, memory=memory, verbose=True)

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def text_to_speech(text):
    tts = gTTS(text=text, lang='en')
    tts.save("static/response.mp3")
    return "static/response.mp3"

def speech_to_text(audio_file):
    r = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
    
    try:
        transcription = groq_client.audio.transcriptions.create(
            file=("audio.wav", audio_file.read()),
            model="whisper-large-v3",
            response_format="text"
        )
        return transcription
    except Exception as e:
        return str(e)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        filename = secure_filename(file.filename)
        file_path = os.path.join('uploads', filename)
        file.save(file_path)
        resume_content = extract_text_from_pdf(file_path)
        return jsonify({"message": "Resume uploaded successfully", "content": resume_content})
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/start_interview', methods=['POST'])
def start_interview():
    resume_content = request.json.get('resume_content')
    if not resume_content:
        return jsonify({"error": "Resume content is required"}), 400
    
    initial_prompt = f"""You are an expert interviewer conducting a job interview. The candidate has uploaded their resume, and you have the following information:

Resume content: {resume_content}

Based on this resume, conduct a professional interview. Start by briefly introducing yourself and asking the candidate for a brief introduction. Then, proceed with relevant questions based on their resume."""

    initial_response = conversation.predict(input=initial_prompt)
    audio_file = text_to_speech(initial_response)
    return jsonify({"response": initial_response, "audio": audio_file})

@app.route('/continue_interview', methods=['POST'])
def continue_interview():
    user_input = request.json.get('user_input')
    if not user_input:
        return jsonify({"error": "User input is required"}), 400
    
    prompt = f"""Continue the professional job interview. Ask relevant follow-up questions based on the candidate's previous responses and their resume. Ensure the conversation flows naturally and mimics a real-life interview environment.

The candidate's latest response is: '{user_input}'

Provide your next question or response."""

    ai_response = conversation.predict(input=prompt)
    audio_file = text_to_speech(ai_response)
    return jsonify({"response": ai_response, "audio": audio_file})

@app.route('/end_interview', methods=['POST'])
def end_interview():
    analysis_prompt = """Based on the entire interview conversation, provide a comprehensive analysis of the candidate. Include the following:

1. Overall impression
2. Strengths demonstrated
3. Areas for improvement
4. Communication skills
5. Technical competence (if applicable)
6. Cultural fit
7. Recommendations for the candidate

Provide a detailed yet concise analysis, offering constructive feedback and actionable insights."""

    analysis = conversation.predict(input=analysis_prompt)
    audio_file = text_to_speech(analysis)
    return jsonify({"analysis": analysis, "audio": audio_file})

@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    audio_file = request.files['audio']
    transcription = speech_to_text(audio_file)
    return jsonify({"transcription": transcription})

if __name__ == "__main__":
    os.makedirs('uploads', exist_ok=True)
    app.run(debug=True)