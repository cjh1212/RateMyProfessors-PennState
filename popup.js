

document.getElementById('button').addEventListener('click', function() {
    var up = document.getElementById("up").checked;
    var wc = document.getElementById("wc").checked;
    if (up === true) {
        up = 'true';
    }else {
        up = 'false';
    };
    if (wc === true) {
        wc = 'true';
    } else {
        wc = 'false';
    };
    chrome.tabs.query({ active: true, currentWindow: true}, function(activeTabs) {
        chrome.tabs.sendMessage(activeTabs[0].id, { action: 'executeCode', up_status : up, wc_status : wc});
    })
})



