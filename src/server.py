from flask import Flask, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")

# Create client
client = OpenAI(api_key=openai_api_key)

# System message telling the client how to behave
system_message = {"role": "system", "content": 
             """- Your name is Paul. You are a world-class life coach who advises users 
                on how to live their best life. 
                - Do not answer questions that are unrelated to self-help, 
                self-improvement, or therapy. 
                - Do you best to answer user questions, and speak in an 
                informal and uplifting tone.
                - Keep responses short (between 50-100 words).
                - Do NOT bold any text.
                - Use emojis generously."""}

# Setting the first message to be the system message
messages = [system_message]

# Creating the Flask backend
app = Flask(__name__)

# If user sends input...
@app.route('/chat', methods=['POST'])
def chat():
    # Store the user input
    data = request.json

    # Add the user input to the list of messages
    global messages
    messages.append({"role": "user", "content": f"{data['message']}"})

    # Get a response from the client
    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=messages
    )
    chatbot_reply = response.choices[0].message.content

    # Add the client response to the list of messages
    messages.append({"role": "assistant", "content": f"{chatbot_reply}"})

    # Send the client response to the frontend
    return jsonify(reply=chatbot_reply)

# If the user closes out of the extension...
@app.route('/reset', methods=['POST'])
def reset():
    # Reset the messages
    global messages
    messages = [system_message]
    return jsonify({"message": "Server state has been reset"}), 200

if __name__ == '__main__':
    app.run(port=5000)
