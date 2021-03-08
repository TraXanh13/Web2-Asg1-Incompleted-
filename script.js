document.addEventListener("DOMContentLoaded", function () {
    //variables and hiding

    document.querySelector("#loader1").style.visibility = "hidden";
    document.querySelector("#loader2").style.visibility = "hidden";
    document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "hidden" });
    const companyTbl = document.querySelector("#companyTabel tbody");
    const stockTbl = document.querySelector("#stockTabel tbody");
    const companiesAPI = "https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php";
    const stockAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol='
    //calling appropiate functions
    let companyCollection = retrieveStorage();
    fetchCompanies();
    populateCompanies();

    /* --------------- FUNCTIONS taken from ex11 ---------------------- */


    // update storage with revised collection
    function updateStorage() {
        localStorage.setItem('companies',
            JSON.stringify(companyCollection));
    }

    // retrieve from storage or return empty array if doesn't exist
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('companies')) || [];
    }

    // removes collection from storage
    function removeStorage() {
        localStorage.removeItem('companies');

    }






    // fetching and loader hiding
    function fetchCompanies() {
        document.querySelector("#loader1").style.visibility = "visible";
        if (!localStorage.getItem('companies')) {
            fetch(companiesAPI)
                .then((response) => response.json())
                .then(data => {
                    let companies = data
                    // adds to collection array
                    companyCollection.push(companies);
                    // update storage with revised collection
                    updateStorage();
                })
        }

        document.querySelector("#loader1").style.visibility = "hidden";
        document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "visible" });
    }

    //populating the company tabel
    function populateCompanies() {
        companyCollection[0].forEach(company => {
            let symbol = document.createElement("td");
            let name = document.createElement("td");
            let row = document.createElement("tr");

            symbol.setAttribute("class", "symbol");
            symbol.textContent = company.symbol;

            name.textContent = company.name;

            row.appendChild(symbol);
            row.appendChild(name);
            companyTbl.appendChild(row);
        });
    }


    //event onclick
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener("click", (e) => {
            populateInfo(e.target.textContent);
        })
    });

    //populates info
    function populateInfo(target) {
        document.querySelector("#logo").innerHTML = "";
        let img = document.createElement("img");
        let symbol = document.querySelectorAll(".sym");
        let name = document.querySelectorAll(".name");
        let sector = document.querySelector("#sector");
        let subindustry = document.querySelector("#sub");
        let address = document.querySelector("#address");
        let website = document.querySelector("#website");
        let exchange = document.querySelector("#exhange");
        let desc = document.querySelectorAll(".desc");

        companyCollection[0].forEach(company => {
            if (company.name == target || company.symbol == target) {
                img.setAttribute("src", `./logos/${company.symbol}.svg`);
                img.setAttribute("alt", `${company.symbol}.svg`);
                document.querySelector("#logo").appendChild(img);
                symbol.forEach(e => { e.textContent = company.symbol });
                name.forEach(e => { e.textContent = company.name });
                sector.textContent = company.sector;
                subindustry.textContent = company.subindustry;
                address.textContent = company.address;
                website.setAttribute("href", company.website);
                website.textContent = company.website;
                exchange.textContent = company.exchange;
                desc.forEach(e => { e.textContent = company.description });
                lat = company.latitude;
                lng = company.longitude;
                initMap();
                populateStock(company.symbol);

            }
        });
    }

    //populate the stock data
    function populateStock(symbol) {
        document.querySelector("#loader2").style.visibility = "visible";
        stockTbl.innerHTML = "";
        fetch(stockAPI + symbol)
            .then(resp => resp.json())
            .then(data => {
                data.forEach(e => {
                    let date = document.createElement("td");
                    let open = document.createElement("td");
                    let close = document.createElement("td");
                    let high = document.createElement("td");
                    let low = document.createElement("td");
                    let volumeFields = document.createElement("td");
                    let row = document.createElement("tr");

                    date.textContent = e.date;
                    open.textContent = "$" + parseFloat(e.open).toFixed(2);
                    close.textContent = "$" + parseFloat(e.close).toFixed(2);
                    high.textContent = "$" + parseFloat(e.high).toFixed(2);
                    low.textContent = "$" + parseFloat(e.low).toFixed(2);
                    volumeFields.textContent = e.volume;
                    row.appendChild(date);
                    row.appendChild(open);
                    row.appendChild(close);
                    row.appendChild(high);
                    row.appendChild(low);
                    row.appendChild(volumeFields);

                    stockTbl.appendChild(row);
                });
                document.querySelector("#loader2").style.visibility = "hidden";
            })
    }

    // Changing the view on the button press
    let chartBtn = document.querySelector("#moreCharts");
    chartBtn.addEventListener("click", () => {
        document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "hidden" });
        document.querySelectorAll(".view2").forEach(e => { e.style.visibility = "visible" });
    });

    // Reverting the view
    let closeBtn = document.querySelector("#close");
    closeBtn.addEventListener("click", ()=>{
        document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "visible" });
        document.querySelectorAll(".view2").forEach(e => { e.style.visibility = "hidden" });
    });

    //event for seorting stock data
    const sort = document.querySelectorAll(".sortable tr th");
    sort.forEach(e => {
        e.addEventListener("click", () => {
            //i'm not a monster, don't judge me
            sortStock(e.textContent.toLocaleLowerCase().split(" ")[0], document.querySelector(".sym").textContent);
        })
    });

    // sort the stock data
    function sortStock(word, symbol) {
        document.querySelector("#loader2").style.visibility = "visible";
        stockTbl.innerHTML = "";
        fetch(stockAPI + symbol)
            .then(resp => resp.json())
            .then(data => {
                console.log(word);
                console.log(data.sort((a,b) => {return a.word - b.word}));
                
                data.forEach(e => {

                    let date = document.createElement("td");
                    let open = document.createElement("td");
                    let close = document.createElement("td");
                    let high = document.createElement("td");
                    let low = document.createElement("td");
                    let volumeFields = document.createElement("td");
                    let row = document.createElement("tr");

                    date.textContent = e.date;
                    open.textContent = "$" + parseFloat(e.open).toFixed(2);
                    close.textContent = "$" + parseFloat(e.close).toFixed(2);
                    high.textContent = "$" + parseFloat(e.high).toFixed(2);
                    low.textContent = "$" + parseFloat(e.low).toFixed(2);
                    volumeFields.textContent = e.volume;
                    row.appendChild(date);
                    row.appendChild(open);
                    row.appendChild(close);
                    row.appendChild(high);
                    row.appendChild(low);
                    row.appendChild(volumeFields);

                    stockTbl.appendChild(row);
                });

                document.querySelector("#loader2").style.visibility = "hidden";
            })
    }

    // Speech button from lab 10 ex 12
    document.querySelector('#speak').addEventListener('click', (e) => {
            let ctx = document.querySelector(".name").textContent;
            ctx += " " + document.querySelector(".desc").textContent;
                    
            let speech = new SpeechSynthesisUtterance(ctx);
            speechSynthesis.speak(speech);
        });
});

// Creating the Map
var map;
let lat = 0;
let lng = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: lat, lng: lng },
        zoom: 18
    });
}