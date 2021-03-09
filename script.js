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

    //event handling for the go value 

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
    });

    // Simple bar graph from https://echarts.apache.org/en/tutorial.html#Get%20Started%20with%20ECharts%20in%205%20minutes
    let barGraph = echarts.init(document.querySelector("#bargraph"));

    let barGraphSetting = {
        title: {
            text: "Fuck you"
        },
        legend: {
            data: ["Revenue", "Earnings", "Assets", "Liabilities"]
        },
        dataset: {
            source: [
                ["Thing", "Revenue", "Earnings", "Assets", "Liabilities"],
                ["test 1", 1, 2, 3, 4],
                ["test 2", 2, 4, 1, 3]
            ]
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: [
            {type:"bar"},
            {type:"bar"},
            {type:"bar"},
            {type:"bar"}
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
            text: '折线图堆叠'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {},
        series: [
            {
                name: '邮件营销',
                type: 'line',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '联盟广告',
                type: 'line',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: '视频广告',
                type: 'line',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '直接访问',
                type: 'line',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '搜索引擎',
                type: 'line',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
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