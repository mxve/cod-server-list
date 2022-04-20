function showSearchOptions() {
    for (e of document.getElementsByClassName('search-players')) {
        e.style.display = 'inline-block'
    }
}

document.getElementById("searchbar").addEventListener("click", showSearchOptions)