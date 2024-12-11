let vlist = [];
let recorders = [];

function populateParticipants() {
    const participantsList = document.getElementById('participantsList');
    participantsList.innerHTML = '';

    vlist.forEach((item, index) => {
        const participantDiv = document.createElement('div');
        participantDiv.classList.add('participant');

        const nameDiv = document.createElement('span');
        nameDiv.textContent = item[1];
        participantDiv.appendChild(nameDiv);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.onclick = () => startRecording(index);
        participantDiv.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop';
        stopButton.onclick = () => stopRecording(index);
        participantDiv.appendChild(stopButton);

        participantsList.appendChild(participantDiv);
    });
}

async function refreshParticipants() {
    chrome.runtime.sendMessage({ action: "getParticipants" }, (response) => {
        if (response.status === "done") {
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === "participantsList") {
                    const newParticipants = request.participants;
                    newParticipants.forEach(newParticipant => {
                        const exists = vlist.some(existingParticipant => existingParticipant[1] === newParticipant[1]);
                        if (!exists) {
                            vlist.push(newParticipant);
                        }
                    });
                    populateParticipants();
                }
            });
        }
    });
}

async function startRecording(index) {
    console.log(vlist)
    const recorder = new RecordRTCPromisesHandler(vlist[index][0], {
        type: 'video',
        mimeType: 'video/webm;codecs=vp8,opus'
    });

    await recorder.startRecording();
    recorders[index] = recorder;
    console.log(`Recording started for ${vlist[index][1]}`);
}

async function stopRecording(index) {
    const recorder = recorders[index];
    if (!recorder) return;

    await recorder.stopRecording();
    const blob = await recorder.getBlob();
    invokeSaveAsDialog(blob);
    console.log(`Recording stopped for ${vlist[index][1]}`);
}

document.getElementById('refreshButton').addEventListener('click', refreshParticipants);