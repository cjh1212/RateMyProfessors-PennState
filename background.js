// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.type == "profRating") {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", request.url, true);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState == 4) {
//                     console.log(xhr.responseText);
//                     sendResponse({ JSONresponse: JSON.parse(xhr.responseText) });
//                 }
//             }
//             xhr.send();
//         } else if (request.type == "allurl") {
//             var xhr = new XMLHttpRequest();
//             xhr.open("GET", request.url, true);
//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState == 4) {
//                     console.log(xhr.responseText);
//                     sendResponse({ JSONresponse: JSON.parse(xhr.responseText) });
//                 }
//             }
//             xhr.send();
//         }
//         return true;
//     });

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'profRating') {
            var url = request.url;
            fetch(url)
                .then(response => response.text())
                .then(response => sendResponse(response))
                .catch()
        } else if (request.type == 'allurl') {
            var url = request.url;
            fetch(url)
                .then(response => response.text())
                .then(response => sendResponse(response))
                .catch()
        }
        return true;
    }
)