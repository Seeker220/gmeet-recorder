document.getElementById('refresh').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'refresh' });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateParticipants') {
        const participantsList = document.getElementById('participants');
        participantsList.innerHTML = ''; // Clear the list

        message.participants.forEach(participant => {
            const listItem = document.createElement('li');
            listItem.textContent = participant.name;

            const startButton = document.createElement('button');
            startButton.textContent = 'Start';
            startButton.addEventListener('click', () => {
                chrome.tabs.sendMessage(sender.tab.id, { action: 'start', name: participant.name });
            });

            const stopButton = document.createElement('button');
            stopButton.textContent = 'Stop';
            stopButton.addEventListener('click', () => {
                chrome.tabs.sendMessage(sender.tab.id, { action: 'stop', name: participant.name });
            });

            listItem.appendChild(startButton);
            listItem.appendChild(stopButton);
            participantsList.appendChild(listItem);
        });
    }
});
