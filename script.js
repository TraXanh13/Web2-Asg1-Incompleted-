document.addEventListener("DOMContentLoaded", function () {
    //variables and hiding

    document.querySelector("#loader1").style.visibility = "hidden";
    document.querySelector("#loader2").style.visibility = "hidden";
    document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "hidden" });
    const companyTbl = document.querySelector("#companyTabel tbody");
    const stockTbl = document.querySelector("#stockTabel tbody");
    const companiesAPI = "https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php";
    const stockAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/stocks/history.php?symbol=';
    let type = true;
    //calling appropiate functions

    let companyCollection = retrieveStorage();
    fetchCompanies();
    populateCompanies();

    // Showing the credits for 5 seconds
    const creditView = document.querySelector("#credits");


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
        companyTbl.innerHTML = "";
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

    //event handling for the change in input 

    //event handling for clear btn
    document.querySelector("#clearBtn").addEventListener("click", () => {
        populateCompanies();
        document.querySelector("#filter").value = "";
    })

    //event onclick
    const cells = document.querySelectorAll("#companyTabel tbody tr td");
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
                symbol.forEach(e => { e.textContent = "Symbol: " + company.symbol });
                name.forEach(e => { e.textContent = "Name: " + company.name });
                sector.textContent = "Sector: " + company.sector;
                subindustry.textContent = "Subindustry: " + company.subindustry;
                address.textContent = "Address: " + company.address;
                website.setAttribute("href", company.website);
                website.textContent = company.website;
                exchange.textContent = "Exchange: " + company.exchange;
                desc.forEach(e => { e.textContent = "Description: " + company.description });
                lat = company.latitude;
                lng = company.longitude;
                initMap();
                populateStock(company.symbol);
                setBarData(company.financials);
            }
        });
    }

    //populates the smaller stock data


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
                populateAverage(data);
                populateMin(data);
                populateMax(data);

            })
    }

    //
    function populateAverage(data) {

        document.querySelector("#avg").innerHTML = "";
        let openAvg = 0;
        let closeAvg = 0;
        let highAvg = 0;
        let lowAvg = 0;
        let volumneAvg = 0;
        let open = document.createElement("td");
        let close = document.createElement("td");
        let high = document.createElement("td");
        let low = document.createElement("td");
        let volumeFields = document.createElement("td");
        let th = document.createElement("th");
        th.textContent = "Average";
        document.querySelector("#avg").appendChild(th);

        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            openAvg += Number(parseFloat(e.open).toFixed(2));
            closeAvg += Number(parseFloat(e.close).toFixed(2));
            highAvg += Number(parseFloat(e.high).toFixed(2));
            lowAvg += Number(parseFloat(e.low).toFixed(2));
            volumneAvg += Number(parseInt(e.volume));
        }
        open.textContent = "$" + (openAvg / data.length).toFixed(2);
        close.textContent = "$" + (closeAvg / data.length).toFixed(2);
        high.textContent = "$" + (highAvg / data.length).toFixed(2);
        low.textContent = "$" + (lowAvg / data.length).toFixed(2);
        volumeFields.textContent = (volumneAvg / data.length).toFixed(2);


        document.querySelector("#avg").appendChild(open);
        document.querySelector("#avg").appendChild(close);
        document.querySelector("#avg").appendChild(high);
        document.querySelector("#avg").appendChild(low);
        document.querySelector("#avg").appendChild(volumeFields);
    }

    function populateMin(data) {

        document.querySelector("#min").innerHTML = "";
        let openMin = 9999999;
        let closeMin = 9999999;
        let highMin = 9999999;
        let lowMin = 9999999; 
        let volumneMin = 9999999;
        let open = document.createElement("td");
        let close = document.createElement("td");
        let high = document.createElement("td");
        let low = document.createElement("td");
        let volumeFields = document.createElement("td");
        let th = document.createElement("th");
        th.textContent = "Minimum";
        document.querySelector("#min").appendChild(th);

        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            if(openMin > Number(parseFloat(e.open))) {
                openMin = Number(parseFloat(e.open));
            }
            if(closeMin > Number(parseFloat(e.close))){
                closeMin = Number(parseFloat(e.close));
            }
            if(highMin > Number(parseFloat(e.high))) {
                highMin = Number(parseFloat(e.high));
            }
            if(lowMin > Number(parseFloat(e.low))) {
                lowMin = Number(parseFloat(e.low));
            }

            if(volumneMin > Number(parseInt(e.volume))){
                volumneMin = Number(parseInt(e.volume));
            }
        }
        open.textContent = "$" + openMin.toFixed(2);
        close.textContent = "$" + closeMin.toFixed(2);
        high.textContent = "$" + highMin.toFixed(2);
        low.textContent = "$" + lowMin.toFixed(2);
        volumeFields.textContent = volumneMin;


        document.querySelector("#min").appendChild(open);
        document.querySelector("#min").appendChild(close);
        document.querySelector("#min").appendChild(high);
        document.querySelector("#min").appendChild(low);
        document.querySelector("#min").appendChild(volumeFields);
    }

    function populateMax(data) {

        document.querySelector("#max").innerHTML = "";
        let openMax = 0;
        let closeMax = 0;
        let highMax = 0;
        let lowMax = 0; 
        let volumneMax = 0;
        let open = document.createElement("td");
        let close = document.createElement("td");
        let high = document.createElement("td");
        let low = document.createElement("td");
        let volumeFields = document.createElement("td");
        let th = document.createElement("th");
        th.textContent = "Maximum";
        document.querySelector("#max").appendChild(th);

        for (let index = 0; index < data.length; index++) {
            const e = data[index];
            if(openMax < Number(parseFloat(e.open))) {
                openMax = Number(parseFloat(e.open));
            }
            if(closeMax < Number(parseFloat(e.close))){
                closeMax = Number(parseFloat(e.close));
            }
            if(highMax < Number(parseFloat(e.high))) {
                highMax = Number(parseFloat(e.high));
            }
            if(lowMax < Number(parseFloat(e.low))) {
                lowMax = Number(parseFloat(e.low));
            }

            if(volumneMax < Number(parseInt(e.volume))){
                volumneMax = Number(parseInt(e.volume));
            }
        }
        open.textContent = "$" + openMax.toFixed(2);
        close.textContent = "$" + closeMax.toFixed(2);
        high.textContent = "$" + highMax.toFixed(2);
        low.textContent = "$" + lowMax.toFixed(2);
        volumeFields.textContent = volumneMax;


        document.querySelector("#max").appendChild(open);
        document.querySelector("#max").appendChild(close);
        document.querySelector("#max").appendChild(high);
        document.querySelector("#max").appendChild(low);
        document.querySelector("#max").appendChild(volumeFields);
    }
    // Changing the view on the button press
    let chartBtn = document.querySelector("#moreCharts");
    chartBtn.addEventListener("click", () => {
        document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "hidden" });
        document.querySelectorAll(".view2").forEach(e => { e.style.visibility = "visible" });
    });

    // Reverting the view
    let closeBtn = document.querySelector("#close");
    closeBtn.addEventListener("click", () => {
        document.querySelectorAll(".view1").forEach(e => { e.style.visibility = "visible" });
        document.querySelectorAll(".view2").forEach(e => { e.style.visibility = "hidden" });
    });

    //event for sorting stock data
    const sort = document.querySelectorAll(".sortable thead tr th");
    sort.forEach(e => {
        e.addEventListener("click", (e) => {
            //i'm not a monster, don't judge me
            const cells = document.querySelectorAll("#stockTabel thead th");
            for (let index = 0; index < cells.length; index++) {
                const cell = cells[index];
                if (cell.textContent == e.target.textContent) {
                    sortTable(index);
                }
            }
        })
    });

    // sort the stock data
    function sortTable(column) {
        //modifers nad variables
        const modifier = type ? 1 : -1;
        const row = Array.from(document.querySelectorAll("#stockTabel tbody tr"));

        //sorts the rows
        const sortedRows = row.sort((a, b) => {
            const cellA = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            const cellB = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
            return cellA > cellB ? (1 * modifier) : (-1 * modifier);
        });

        //delete all tr(s)
        stockTbl.innerHTML = "";

        //readding the row
        stockTbl.append(...sortedRows);

        //change the modifier
        type = !type;

    }

    // Speech button from lab 10 ex 12
    document.querySelector('#speak').addEventListener('click', (e) => {
        let ctx = document.querySelector(".name").textContent;
        ctx += " " + document.querySelector(".desc").textContent;

        let speech = new SpeechSynthesisUtterance(ctx);

        speechSynthesis.speak(speech);
    });

    // Simple bar graph from https://echarts.apache.org/examples/en/editor.html?c=dataset-simple0
    let barGraph = echarts.init(document.querySelector("#bargraph"));
    var finan2017;
    var finan2018;
    var finan2019;

    // Set the arrays for each financial year
    function setBarData(company) {
        console.log(company);
        // Year, Asset, Earning, Liabilities, revenue
        finan2017 = [company.years[2], company.assets[2], company.earnings[2], company.liabilities[2], company.revenue[2]];
        finan2018 = [company.years[1], company.assets[1], company.earnings[1], company.liabilities[1], company.revenue[1]];
        finan2019 = [company.years[0], company.assets[0], company.earnings[0], company.liabilities[0], company.revenue[0]];
    }

    let barGraphSetting = {
        legend: {
            data: ["Revenue", "Earnings", "Assets", "Liabilities"]
        },
        dataset: {
            source: [
                ["Thing", "Revenue", "Earnings", "Assets", "Liabilities"],
                /*
                [finan2017[0], finan2017[4], finan2017[2], finan2017[1], finan2017[3]],
                [finan2018[0], finan2018[4], finan2018[2], finan2018[1], finan2018[3]],
                [finan2019[0], finan2019[4], finan2019[2], finan2019[1], finan2019[3]],
                */
                ["test 2", 2, 4, 1, 3]
            ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
            { type: "bar" },
            { type: "bar" },
            { type: "bar" },
            { type: "bar" }
        ]
    };

    barGraph.setOption(barGraphSetting);

    // Sample candle graph from https://echarts.apache.org/examples/en/editor.html?c=candlestick-simple
    let candles = echarts.init(document.querySelector("#candleGraph"));

    let candleSetting = {
        title: {
            text: "Candlestick Graph"
        },
        xAxis: {
            data: ["1", "2", "3"]
        },
        yAxis: {},
        series: [{
            type: "k",
            data: [
                // close, open, low, high
                [20, 15, 5, 21],
                [20, 25, 10, 27],
                [20, 19, 5, 30]
            ]
        }]
    }

    candles.setOption(candleSetting);

    // Sample line graph from https://echarts.apache.org/examples/en/editor.html?c=line-stack
    let lineGraph = echarts.init(document.querySelector("#lineChart"));

    let lineSettings = {
        title: {
            text: 'Close value and Volume Graph'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Close Value', 'Volume']
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ["1", "2", "3"]
        },
        yAxis: {},
        series: [
            {
                name: 'Close Value',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'Volume',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
        ]
    };

    lineGraph.setOption(lineSettings);

});

// Creating the Map
var map;
let lat = 0;
let lng = 0;

function initMap() {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: { lat: lat, lng: lng },
        zoom: 18
    });
}