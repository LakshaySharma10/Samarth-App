import streamlit as st
import PyPDF2
import io
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv
import os
import time
import threading
import speech_recognition as sr
from gtts import gTTS
import pygame
from groq import Groq

# Load environment variables
load_dotenv()

# Set page config
st.set_page_config(page_title="AI Voice Interview Bot", page_icon="🎙️")

# Initialize the language model
@st.cache_resource
def init_llm():
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key:
        st.error("GROQ_API_KEY not found. Please set it in your .env file.")
        st.stop()
    return ChatGroq(groq_api_key=groq_api_key, model_name="llama-3.1-70b-versatile")

llm = init_llm()
groq_client = Groq()

# Create a conversation memory
memory = ConversationBufferMemory(return_messages=True)

# Create a conversation chain
conversation = ConversationChain(llm=llm, memory=memory, verbose=True)

# Initialize pygame mixer for audio playback
pygame.mixer.init()

def extract_text_from_pdf(pdf_file):
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def text_to_speech(text):
    tts = gTTS(text=text, lang='en')
    tts.save("response.mp3")
    pygame.mixer.music.load("response.mp3")
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        pygame.time.Clock().tick(10)

def speech_to_text():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        st.write("Listening...")
        audio = r.listen(source, timeout=None, phrase_time_limit=15)
    
    try:
        with open("audio.wav", "wb") as f:
            f.write(audio.get_wav_data())
        
        with open("audio.wav", "rb") as file:
            transcription = groq_client.audio.transcriptions.create(
                file=("audio.wav", file.read()),
                model="whisper-large-v3",
                response_format="text"
            )
        return transcription
    except Exception as e:
        st.error(f"Error in speech recognition: {str(e)}")
        return None

def monitor_silence(stop_event):
    start_time = time.time()
    while not stop_event.is_set():
        if time.time() - start_time > 15:
            st.write("Do you need some extra time to think?")
            text_to_speech("Do you need some extra time to think?")
            start_time = time.time()
        time.sleep(1)

def main():
    st.title("AI Voice Interview Bot")

    # File uploader for resume
    uploaded_file = st.file_uploader("Upload your resume (PDF)", type="pdf")

    if uploaded_file:
        resume_content = extract_text_from_pdf(uploaded_file)
        st.success("Resume uploaded successfully!")
        st.session_state.resume_content = resume_content

    # Start interview button
    if st.button("Start Interview"):
        if "resume_content" not in st.session_state:
            st.error("Please upload your resume before starting the interview.")
        else:
            st.session_state.interview_started = True
            st.session_state.messages = []
            st.session_state.interview_start_time = time.time()
            initial_prompt = f"""You are an expert interviewer conducting a job interview. The candidate has uploaded their resume, and you have the following information:

Resume content: {st.session_state.resume_content}

Based on this resume, conduct a professional interview. Start by briefly introducing yourself and asking the candidate for a brief introduction. Then, proceed with relevant questions based on their resume."""

            initial_response = conversation.predict(input=initial_prompt)
            st.session_state.messages.append({"role": "assistant", "content": initial_response})
            text_to_speech(initial_response)

    # Display chat messages
    if "messages" in st.session_state:
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.write(message["content"])

    # Voice-based interaction
    if "interview_started" in st.session_state and st.session_state.interview_started:
        stop_event = threading.Event()
        silence_thread = threading.Thread(target=monitor_silence, args=(stop_event,))
        silence_thread.start()

        user_input = speech_to_text()
        stop_event.set()
        silence_thread.join()

        if user_input:
            # Display user message
            with st.chat_message("user"):
                st.write(user_input)
            st.session_state.messages.append({"role": "user", "content": user_input})
            
            # Get and display AI response
            prompt = f"""Continue the professional job interview. Ask relevant follow-up questions based on the candidate's previous responses and their resume. Ensure the conversation flows naturally and mimics a real-life interview environment.

The candidate's latest response is: '{user_input}'

Provide your next question or response."""

            ai_response = conversation.predict(input=prompt)
            with st.chat_message("assistant"):
                st.write(ai_response)
            st.session_state.messages.append({"role": "assistant", "content": ai_response})
            text_to_speech(ai_response)

        # Check if interview time exceeds 45 minutes
        if time.time() - st.session_state.interview_start_time > 2700:  # 45 minutes in seconds
            st.warning("The interview has reached the maximum time limit of 45 minutes. Please conclude the interview.")

    # End interview and get analysis
    if "interview_started" in st.session_state and st.session_state.interview_started:
        if st.button("End Interview and Get Analysis"):
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
            st.subheader("Interview Analysis")
            st.write(analysis)
            text_to_speech(analysis)
            st.session_state.interview_started = False

if __name__ == "__main__":
    main()