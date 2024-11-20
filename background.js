
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getWordDetails') {
        fetchFromPythonServer(request.word)
            .then(response => sendResponse(response))
            .catch(error => {
                console.error("Error fetching word details:", error);
                sendResponse({ error: "Failed to fetch word details. Please try again later." });
            });
        return true;
    }
});

async function fetchFromPythonServer(word) {
    try {
        const response = await fetch(`http://localhost:5000/get_word_details?word=${encodeURIComponent(word)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching from Python server:", error);
        return { error: "Failed to fetch word details from backend." };
    }
}
