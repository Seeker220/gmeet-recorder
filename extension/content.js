chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getParticipants") {
        let pl = [];
        const divs = document.querySelectorAll('div[data-ssrc]');

        divs.forEach(div => {
            let originalDiv = div;
            let currentDiv = div;
            let span = currentDiv.querySelector('div[style="text-overflow: ellipsis; overflow: hidden;"] span.notranslate');

            while (currentDiv && !span) {
                span = currentDiv.querySelector('div[style="text-overflow: ellipsis; overflow: hidden;"] span.notranslate');
                if (span) {
                    pl.push({ div: originalDiv, name: span.textContent });
                    break;
                }
                currentDiv = currentDiv.parentElement;
            }
        });

        let vlist = [];
        pl.forEach(item => {
            let originalDiv = item.div;
            let name = item.name;
            let videos = originalDiv.childNodes;
            let vltemp = [];

            videos.forEach(video => {
                if (video.srcObject !== null) {
                    vltemp.push(video.srcObject);
                }
            });

            vlist.push([vltemp, name]);
        });
        sendResponse({ participants: vlist });
    }
});