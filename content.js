
document.addEventListener('mouseup', function() {
    const selectedText = window.getSelection().toString().trim();      
    if (selectedText) {
        chrome.runtime.sendMessage({ action: 'getWordDetails', word: selectedText }, function(response) {
            displayPopup(response);
        });
    }
});

function displayPopup(data) {
    let existingPopup = document.getElementById('word-popup');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 'word-popup';
    popup.style.position = 'absolute';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '10px';
    popup.style.zIndex = 9999;
    popup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';

    const synonyms = Array.isArray(data.synonyms) ? data.synonyms : ["No synonyms found"];
    const definition = data.definition || "No definition available";

    popup.innerHTML = `
        <strong>${data.word}</strong><br>
        <em>${definition}</em><br>
        <strong>Synonyms:</strong> ${synonyms.length > 0 ? synonyms.join(', ') : "No synonyms available"}
    `;
    document.body.appendChild(popup);

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        popup.style.top = `${rect.top + window.scrollY + rect.height}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
    } else {
        popup.style.top = `${window.scrollY + 20}px`;
        popup.style.left = `${window.scrollX + 20}px`;
    }
}
