chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'refresh' || message.action === 'start' || message.action === 'stop') {
        chrome.tabs.sendMessage(sender.tab.id, message);
    }
});
