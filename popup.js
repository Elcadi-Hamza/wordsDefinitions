chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getWordDetails') {
        const word = request.word;
        const definition = request.definition || 'No definition available.';
        const synonyms = request.synonyms || ['No synonyms found.'];

        document.getElementById('word').textContent = word;
        document.getElementById('definition').textContent = definition;

        const synonymsList = document.getElementById('synonymsList');
        synonymsList.innerHTML = '';
        synonyms.forEach(synonym => {
            const listItem = document.createElement('li');
            listItem.classList.add('synonym-item');
            listItem.textContent = synonym;
            synonymsList.appendChild(listItem);
        });
    }
});
