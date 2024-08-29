import streamlit as st
import PyPDF2
import io
from langchain_groq import ChatGroq
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Set page config
st.set_page_config(page_title="AI Interview Bot", page_icon="🤖")

# Initialize the language model
@st.cache_resource
def init_llm():
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key:
        st.error("GROQ_API_KEY not found. Please set it in your .env file.")
        st.stop()
    return ChatGroq(groq_api_key=groq_api_key, model_name="llama-3.1-70b-versatile")

llm = init_llm()

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

def main():
    st.title("AI Interview Bot")

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
            initial_prompt = f"""You are an expert interviewer conducting a job interview. The candidate has uploaded their resume, and you have the following information:

Resume content: {st.session_state.resume_content}

Based on this resume, conduct a professional interview. Start by briefly introducing yourself and asking the candidate for a brief introduction. Then, proceed with relevant questions based on their resume."""

            initial_response = conversation.predict(input=initial_prompt)
            st.session_state.messages.append({"role": "assistant", "content": initial_response})

    # Display chat messages
    if "messages" in st.session_state:
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.write(message["content"])

    # Chat input
    if "interview_started" in st.session_state and st.session_state.interview_started:
        user_input = st.chat_input("Your response")
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
            st.session_state.interview_started = False

if __name__ == "__main__":
    main()