let participants = [];
let recorders = {};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'refresh') {
        updateParticipants();
    } else if (message.action === 'start') {
        startRecording(message.name);
    } else if (message.action === 'stop') {
        stopRecording(message.name);
    }
});

function updateParticipants() {
    let pl = [];
    const divs = document.querySelectorAll('div[data-ssrc]');
    divs.forEach(div => {
        let currentDiv = div;
        let span = currentDiv.querySelector('div[style="text-overflow: ellipsis; overflow: hidden;"] span.notranslate');
        while (currentDiv && !span) {
            currentDiv = currentDiv.parentElement;
            span = currentDiv?.querySelector('div[style="text-overflow: ellipsis; overflow: hidden;"] span.notranslate');
        }
        if (span) {
            pl.push({ div, name: span.textContent });
        }
    });

    participants = pl.map(item => ({ name: item.name, div: item.div }));
    chrome.runtime.sendMessage({ action: 'updateParticipants', participants });
}

function startRecording(participantName) {
    const participant = participants.find(p => p.name === participantName);
    if (!participant) return;

    const videoElem = participant.div.querySelector('video');
    if (!videoElem) return;

    const recorder = new RecordRTCPromisesHandler(videoElem.captureStream(), {
        type: 'video',
        mimeType: 'video/webm;codecs=vp8,opus'
    });
    recorder.startRecording();
    recorders[participantName] = recorder;
}

async function stopRecording(participantName) {
    const recorder = recorders[participantName];
    if (!recorder) return;

    await recorder.stopRecording();
    const blob = await recorder.getBlob();
    invokeSaveAsDialog(blob, `${participantName}.webm`);
    delete recorders[participantName];
}
