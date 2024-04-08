import confluenceInfo from './confluenceinfo.js';

document.addEventListener("DOMContentLoaded", function () {
  const confluenceTitle = document.getElementById("confluence-title");
  const chatMessages = document.getElementById("chat-messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const confluenceDropdown = document.getElementById("confluence-dropdown");
  const confluenceThumbnail = document.getElementById("confluence-thumbnail");
  const projectCode = document.getElementById("projectCode");
  const linkElement = document.getElementById("linkElement");
  const summaryElement = document.getElementById("summaryElement");  
  const loadingSpinner = document.getElementsByClassName('loading-spinner')[0];
  loadingSpinner.style.display = 'none';
  var botColor = '#0000';

  sendButton.addEventListener("click", async function () {
    sendMessage();
  });

  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  confluenceDropdown.addEventListener("change", function () {
    updateconfluenceInfo();
  });

  updateconfluenceInfo();

  async function updateconfluenceInfo() {
    chatMessages.innerHTML = "";    
    const selectedconfluence = parseInt(confluenceDropdown.value) - 1;
    const confluenceData = confluenceInfo['confluenceInfo'][selectedconfluence];
    confluenceThumbnail.src = confluenceData.thumbnail;
    projectCode.textContent = confluenceData.projectCode;
    while (linkElement.firstChild) {
        linkElement.removeChild(linkElement.firstChild);
    }
    var linkElement2 = document.createElement('a');
    linkElement2.href = confluenceData.link;
    linkElement2.textContent = 'Click here';
    linkElement.appendChild(linkElement2);


    summaryElement.textContent = confluenceData.summary;
    confluenceTitle.style.background = confluenceData.color;
    botColor = confluenceData.color;
  }

  async function sendMessage() {
    const userMessage = messageInput.value;
    appendMessage("User", userMessage);
    messageInput.value = "";
    toggleLoadingSpinner(true);
    try {
      const botResponse = await getBotResponse(userMessage);
      appendMessage("Chatbot", botResponse);
    } catch (error) {
      console.error("Error:", error);
      appendMessage("Chatbot", "An error occurred while processing your request.");
    } finally {
      toggleLoadingSpinner(false);
      messageInput.focus();
    }
  }

  async function getBotResponse(userMessage) {
    const selectedconfluence = confluenceDropdown.value;
    const requestData = {
      FolderNumber: selectedconfluence,
      Query: userMessage
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/make_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      if (response.ok) {
        const responseData = await response.json();
        return responseData.message;
      } else {
        console.error("Error:", response.status, response.statusText);
        throw new Error("An error occurred while processing your request.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      throw new Error("An error occurred while processing your request.");
    }
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    if (sender == 'User'){
      messageElement.style.color = 'black';
    }
    else{
      messageElement.style.color = botColor;
    }
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function toggleLoadingSpinner(show) {    
    messageInput.disabled = show;
    sendButton.disabled = show;
  
    if (show) {
      loadingSpinner.style.display = 'flex';
    } else {
      loadingSpinner.style.display = 'none';
    }
  }

});