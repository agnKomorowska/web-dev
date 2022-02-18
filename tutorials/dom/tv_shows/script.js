window.onload = function() {
    showsApp.init();
}

let showsApp = {
    data: null,
    searchInput: null, 
    showsDataSection: null,

    init: function() {
        console.log("App started");

        this.searchInput = document.getElementById("search-input");
        this.searchInput.addEventListener("keyup", (e) => {
            if(e.key === "Enter") {
                console.log("Enter clicked");
                this.loadData(this.searchInput.value);
            }
        });
        
        this.showsDataSection = document.querySelector("#shows-data-section");
        
    }, 

    loadData: function(str) {
        fetch("https://api.tvmaze.com/search/shows?q=" + str.trim()) 
        .then(response => response.json())
        .then(data => this.prepareData(data));
    },

    prepareData: function(showData) {
        this.data = showData;
        console.log(this.data);

        let allBoxesHtml = "";

        for (let i = 0; i < showData.length; i++) {
            let show = showData[i];
            let score = show.score;
            show = show.show;

            let title = null;
            if (show.name) {
                title = show.name;
            } else {
                continue;
            }

            let genres = show.genres.join(", ");
            console.log(genres);

            let img = null;
            if (show.image) { 
                img = show.image.original;
                console.log(img);
            } else {
                img = "https://cdn.pixabay.com/photo/2013/07/12/17/47/test-pattern-152459_960_720.png";
            }

            let network = "N/A";
            if (show.network) {
                network = show.network.name;
            }

            let officialSite = "N/A";
            if (show.officialSite) {
                officialSite = show.officialSite;
            }

            let premiered = "N/A";
            if (show.premiered) {
                pemiered = show.premiered;
            }

            let summary = show.summary;
            summary = `
                <p>Title: ${title} </p>
                <p>Premiere Date: ${premiered} </p>
                <p>Network: ${network} </p>
                <br>
            ` + summary;
            console.log(summary);

            allBoxesHtml += this.getShowBox(img, title, genres, summary);
        }

        this.showsDataSection.innerHTML = allBoxesHtml;
    },

    getShowBox: function (img, title, genres, overview) {
        return `
            <div class="show-box">
                <img src="${img}" alt="">
                    <div class="show-title">${title}</div>
                    <div class="show-genres">${genres}</div>
                    <div class="show-overview">${overview}</div>
            </div>
        `;
        
    }
};