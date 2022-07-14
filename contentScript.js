function showRating(myurl, i, rating, cell, pa, firstName, lastName, table1) {
    chrome.runtime.sendMessage({ url: myurl, type: "profRating"}, function (response) {
        var res = JSON.parse(response);

        if (res.response.numFound > 0){
            var profID = res.response.docs[0].pk_id;
            var allurl = "https://www.ratemyprofessors.com/paginate/professors/ratings?tid=" + profID + "&page=0&max=20";
            rating = res.response.docs[0].averageratingscore_rf;
            cell.innerHTML = " " + rating;
            cell.setAttribute("class", "tooltip PSLEVEL3GRIDODDROW");
            cell.setAttribute("style", "white-space: nowrap;");
            cell.setAttribute("align", "center");
            // information in details
            var detail = document.createElement("div");
            var title = document.createElement("h3");
            title.innerHTML = 'Details from Rate My Professor <br><br>';
            var professor = document.createElement("p");
            professor.innerHTML = "<b>Name:</b> " + firstName + " " + lastName;
            var rr = document.createElement("p");
            rr.innerHTML = "<b>Rating: </b>" + rating + "/5.0";
            var based = document.createElement("p");
            based.innerHTML = "<br>Overall Rating based on " + res.response.docs[0].total_number_of_ratings_i + " ratings";
            var easyScore = document.createElement("p");
            easyScore.innerHTML = "<b>Level of Difficulty: </b>" + res.response.docs[0].averageeasyscore_rf;
            var department = document.createElement("p");
            department.innerHTML = "<b>Department:</b> " + res.response.docs[0].teacherdepartment_s;
            var redir = document.createElement("a");
            redir.innerHTML = "<br>Click to see details on Rate My Professors";
            redir.href = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + profID;
            redir.target = "_blank"

            detail.append(title);
            detail.append(professor);
            detail.append(rr);
            detail.append(easyScore);
            detail.append(based);
            detail.append(redir);
            moreDetails(allurl, detail);
        } else {
            cell.innerHTML = "Null";
            cell.setAttribute("class", "PSLEVEL3GRIDODDROW");
            cell.setAttribute("align", "center");
            cell.setAttribute("style", "white-space: nowrap;");
        }

        cell.addEventListener("click", function() {
            table1.innerHTML = '';
            if (cell.innerHTML !== "Null"){
                table1.appendChild(detail);
            }
        })

        paa = pa.contentWindow.document.getElementById('trSSR_CLSRCH_MTG1$' + i + "_row1");        
        paa.append(cell);
        

    });
}

function moreDetails(allurl, detail) {
    chrome.runtime.sendMessage({ url: allurl, type: "allurl"}, function(response) {
        var resp = JSON.parse(response);
        var wouldTakeAgain = 0;
        var wouldTakeAgainNACount = 0;
        for (var i = 0; i < resp.ratings.length; i++) {
            if (resp.ratings[i].rWouldTakeAgain === "Yes") {
                wouldTakeAgain++;
            } else if (resp.ratings[i].rWouldTakeAgain === "N/A") {
                wouldTakeAgainNACount++;
            }
        }
        if (resp.ratings.length >= 8 && wouldTakeAgainNACount < (resp.ratings.length / 2)) {
            wouldTakeAgain = ((wouldTakeAgain / (resp.ratings.length - wouldTakeAgainNACount)) * 100).toFixed(0).toString() + "%";
        } else {
            wouldTakeAgain = "N/A";
        }
        var wouldTakeAgainText = document.createElement("p");
        wouldTakeAgainText.innerHTML = "<b>Would take again: </b>" + wouldTakeAgain;
        detail.insertBefore(wouldTakeAgainText, detail.children[4]);
    })
}

chrome.runtime.onMessage.addListener(function(request) {
    if ($('#divPAGECONTAINER_TGT').children().length > 1) {
        document.getElementById("table1").remove();
    }
    if (request.action === "executeCode") {
        // gary+neal+AND+schoolid_s%3A758
        var myurl = "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";
        var rating;
        // +AND+(schoolid_s%3A758+OR+schoolid_s%3A12141)
        var schoolid = "";
        if (request.up_status === 'true' && request.wc_status === 'true') {
            schoolid = "+AND+(schoolid_s%3A758+OR+schoolid_s%3A12141)";
        } else if (request.up_status === 'true' && request.wc_status === 'false') {
            schoolid = "+AND+schoolid_s%3A758";
        } else if (request.up_status === 'false' && request.wc_status === 'true') {
            schoolid = "+AND+schoolid_s%3A12141"
        }
        var pa = document.getElementById("main_target_win0");


        // showing details
        var table = document.getElementById("divPAGECONTAINER_TGT");
        var table1 = document.createElement("div");
        table1.style.position = "absolute";
        table1.style.top = '80px';
        table1.style.right = '0';
        table1.style.width = 'fit-content';
        table1.style.height = 'fit-content';
        table1.style.border = '3px solid #1d2733';
        table1.innerHTML = "Click rating to see details.";
        table1.id = "table1";

        table.append(table1);

        
        num_instructors = pa.contentWindow.document.querySelectorAll('[id^="MTG_INSTR"]');

        for (let i = 0; i < num_instructors.length; i++) {
            var cell = document.createElement("td");
            var fullName = pa.contentWindow.document.getElementById('MTG_INSTR$' + i).innerHTML;
            var firstName = fullName.split(" ")[0];
            var lastName = fullName.split(" ")[1];
            var myurll = myurl + firstName + "+" + lastName + schoolid;

            //check to prevent twice 
            var checkLength = pa.contentWindow.document.getElementById("trSSR_CLSRCH_MTG1$" + i + "_row1").children.length;
            if (checkLength <= 8){
                // roof
                var pa_upcell = pa.contentWindow.document.getElementById("SSR_CLSRCH_MTG1$scroll$" + i).children[0].children[0];
                var upcell = document.createElement("th");
                upcell.setAttribute("scope", "col");
                upcell.setAttribute("width", "41");
                upcell.setAttribute("class", "PSLEVEL1GRIDCOLUMNHDR");
                upcell.innerHTML = "Rating";
                pa_upcell.append(upcell);

                showRating(myurll, i, rating, cell, pa, firstName, lastName, table1);

            }else{
                var select = pa.contentWindow.document.getElementById("trSSR_CLSRCH_MTG1$" + i + "_row1");
                select.removeChild(select.lastChild);
                showRating(myurll, i, rating, cell, pa, firstName, lastName, table1);
            }

        }
    }
})