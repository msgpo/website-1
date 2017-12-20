---

---

var siteBaseUrl = "{{ site.baseurl }}";

function displaySearchResults(results, store) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
        var appendString = '';

        // TODO differentiate between media and text pages

        for (var i = 0; i < results.length; i++) {  // Iterate over the results
            var item = store[results[i].ref];
            appendString += '<div class="border-box"><div class="search-result-meta"><h4><a href="' + item.url + '">' + item.title + '</a></h4>';
            appendString += '<p><span>' + item.date + '</span></p></div>';
            var cont = item.content.replace(/{% raw %}{{ site.baseurl }}{% endraw %}/g, "{{ site.baseurl }}");
            cont = cont.replace(/{% raw %}{% include press_download-license-warning.html %}{% endraw %}/g, "");
            var div = document.createElement('div');
            console.log(cont);
            div.innerHTML=html = cont.split(/\s+/).slice(0, 400).join(" ");
            appendString += '<div class="search-result-content">' + div.innerHTML + '</div>';
            //appendString += item.content.split(/\s+/).slice(0, 400).join(" ") + '...<br>';
            appendString += '<div class="search-result-meta"><p><a href="' + item.url + '"><i class="fa fa-caret-right" aria-hidden="true"></i> View the whole page</a></p></div>';
            appendString += "</div>";
        }

        searchResults.innerHTML = appendString;
    } else {
        searchResults.innerHTML = '<div id="no-search-results"><br><p class="text-center"><i class="fa fa-3x fa-meh-o" aria-hidden="true"></i><br><br>No results found</p><br></div>';
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');

        if (pair[0] === variable) {
            return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
    }
}

function search(type) {
    if (type == "manual")
        searchTerm = document.getElementById('search-box').value;
    else if (type == "onload")
        var searchTerm = getQueryVariable('s');
    else
        var searchTerm = getQueryVariable('s');

    if (searchTerm) {
        document.getElementById('search-box').setAttribute("value", searchTerm);

        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
            this.field('id');
            this.field('title', {boost: 10});
            this.field('date');
            this.field('content', {boost: 3});
        });

        for (var key in window.store) { // Add the data to lunr
            idx.add({
                'id': key,
                'title': window.store[key].title,
                'date': window.store[key].date,
                'content': window.store[key].content
            });

            var results = idx.search(searchTerm); // Get lunr to perform a search
            displaySearchResults(results, window.store); // We'll write this in the next section
        }
    }
}

search("onload");