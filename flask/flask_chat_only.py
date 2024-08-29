from flask import Flask, request, jsonify
import os
import PyPDF2
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import ConversationChain
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()
groq_api_key = os.environ['GROQ_API_KEY']

# Initialize the language model
llm = ChatGroq(groq_api_key=groq_api_key, model_name="llama-3.1-70b-versatile")

# Create a conversation memory
memory = ConversationBufferMemory(return_messages=True)

# Create a conversation chain
conversation = ConversationChain(llm=llm, memory=memory, verbose=True)

# Global variable to store resume content
resume_content = ""

@app.route('/upload', methods=['POST'])
def upload_resume():
    global resume_content
    if 'resume' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['resume']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(file)
        resume_content = ""
        for page in pdf_reader.pages:
            resume_content += page.extract_text()
        return jsonify({"message": "Resume uploaded successfully"}), 200
    else:
        return jsonify({"error": "Invalid file format. Please upload a PDF."}), 400

@app.route('/start', methods=['GET'])
def start():
    response = "Hello, I hope you're having a great day. I'm ready to begin our interview whenever you are. Please let me know when you're ready to start."
    return jsonify({"response": response})

@app.route('/interview', methods=['POST'])
def interview():
    global resume_content
    user_input = request.json['message']
    
    if not memory.chat_memory:
        # First message in the interview
        prompt = f"""You are an expert interviewer conducting a job interview. The candidate has uploaded their resume, and you have the following information:

Resume content: {resume_content}

Based on this resume, conduct a professional interview. Start by briefly introducing yourself and asking the candidate for a brief introduction. Then, proceed with relevant questions based on their resume and responses.

The candidate's first message is: '{user_input}'

Provide your response and the first interview question."""

    else:
        # Continue the interview
        prompt = f"""Continue the professional job interview. Ask relevant follow-up questions based on the candidate's previous responses and their resume. Ensure the conversation flows naturally and mimics a real-life interview environment.

The candidate's latest response is: '{user_input}'

Provide your next question or response."""

    response = conversation.predict(input=prompt)
    return jsonify({"response": response})

@app.route('/analysis', methods=['GET'])
def analysis():
    prompt = """Based on the entire interview conversation, provide a comprehensive analysis of the candidate. Include the following:

1. Overall impression
2. Strengths demonstrated
3. Areas for improvement
4. Communication skills
5. Technical competence (if applicable)
6. Cultural fit
7. Recommendations for the candidate

Provide a detailed yet concise analysis, offering constructive feedback and actionable insights."""

    analysis_response = conversation.predict(input=prompt)
    return jsonify({"analysis": analysis_response})

if __name__ == '__main__':
    app.run(debug=True)