document.addEventListener("DOMContentLoaded", () => {

    //variables and hiding
    document.querySelector("#loader").style.visibility = "visible";
    document.querySelector("main").style.visibility = "hidden";
    const companyTbl = document.querySelector("tbody");
    const companiesAPI = "https://www.randyconnolly.com/funwebdev/3rd/api/stocks/companies.php";

    //calling appropiate functions
    let companyCollection = retrieveStorage();
    fetchCompanies()
    populateCompanies();



    /* --------------- FUNCTIONS  ---------------------- */


    // update storage with revised collection
    function updateStorage() {
        localStorage.setItem('companies',
            JSON.stringify(companyCollection));
    }

    // retrieve from storage or return empty array if doesn't exist
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('companies'))
            || [];
    }

    // removes collection from storage
    function removeStorage() {
        for (let index = 0; index <= companyCollection.length; index++) {
            localStorage.removeItem('companies');
        }

    }

    console.log(companyCollection);




    // fetching and loader hiding
    function fetchCompanies() {
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

        document.querySelector("#loader").style.visibility = "visible";
        document.querySelector("main").style.visibility = "visible";
    }


    //populating tabel
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


    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.addEventListener("click", (e) => {
            console.log(e.target.textContent);
        })
    });





});