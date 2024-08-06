document.addEventListener('DOMContentLoaded', function() {
  // Select the div elements
  const messagesDiv = document.getElementById('messages');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');

  sendButton.addEventListener('click', () => {
    // Listen for when the send button is clicked
    const userMessage = userInput.value.trim();
    if (userMessage) {
      // Add user message to the chatbox
      addMessageToChat('user', userMessage);
      // Reset the user input
      userInput.value = '';
      // Get the chatbot response
      fetchChatbotResponse(userMessage);
    }
  });

  // Pressing enter is equivalent to hitting the send button
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      // Click the send button
      sendButton.click();
    }
  });
  // Add messages to the chat interface
  function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender.toLowerCase());
    messageElement.textContent = message;
    // Append the message div to the messagesDiv container
    messagesDiv.appendChild(messageElement);
    // Scroll to the bottom of the messagesDiv to show the new message
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Get the chatbot response
  async function fetchChatbotResponse(message) {
    try {
      // Create a POST request to the backend server
      const response = await fetch('http://localhost:5000/chat', { // Must have server.py running in the background
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Include the user message
        body: JSON.stringify({ message: message })
      });
      // Wait for the backend to respond
      const data = await response.json();
      // Add the chatbot message to the chat interface
      addMessageToChat('chatbot', data.reply);
    } catch (error) {
      addMessageToChat('chatbot', `Error: ${error.message}`);
    }
  }
});
