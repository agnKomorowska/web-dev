window.onload = function() {

    var app = new App();

    app.init();

    let formAdd = document.getElementById("form-add");
    let formSearch = document.getElementById("form-search");
    let formFilter = document.getElementById("form-filter");

    formAdd.addEventListener("submit", (e) => {
        let expenseObj = createObjFromFormEntries(e);
        app.addExpense(expenseObj);
    });
    formSearch.addEventListener("submit", (e) => { 
        let searchStr = getSearchStr(e);
        app.searchExpenses(searchStr);
     });
    formFilter.addEventListener("submit", (e) => { 
        let filterObj = createObjFromFormEntries(e);
        let searchStr = document.getElementById("search-str").value;
        app.filterExpenses(searchStr, filterObj);
     });

    let buttonSearchClear = document.getElementById("button-search-clear");
    let buttonFilterClear = document.getElementById("button-filter-clear");
    
    buttonSearchClear.addEventListener("click", () => {
        app.clearSearchStr();
    });

    buttonFilterClear.addEventListener("click", () => {
        app.clearFilters();
    });

    let formView = document.getElementById("form-view"); 
    formView.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("button-remove")) {
            app.removeExpense(e.target);
        }
    })

    function createObjFromFormEntries(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        return Object.fromEntries(data.entries());
    }

    function getSearchStr(e) {
        e.preventDefault();
        const data = new FormData(e.target);

        return data.get('search-str');
    }
}

var App = function() {

    this.currencies = [ "PLN", "GBP", "USD", "EUR" ];
    this.paymentMethods = [ "Cash", "Debit Card", "Credit Card", "Bank Transfer" ];
    this.categories = [ "Housing", "Groceries", "Dining Out", "Personal Care", "Transportation", "Health Care", 
        "Entertainment", "Child Care", "Pet Care", "Miscellaneous" ];
    
        this.expenses = [];
    
    this.init = function() {
        
    }

    this.addExpense = function (expenseObj) {
        expenseObj.totalPrice = +((parseFloat(expenseObj.price)*parseFloat(expenseObj.amount)).toFixed(2));
        this.expenses.push(expenseObj);
        console.log(this.expenses);
        this.resetForm(document.getElementById("form-add"));
        let amount = document.getElementById("amount");
        amount.value = 1;
        this.resetForm(document.getElementById("form-search"));
        this.resetForm(document.getElementById("form-filter"));
        this.showExpenses("", {});
    }

    this.searchExpenses = function(searchStr) {
        this.showExpenses(searchStr, {});
    }

    this.clearSearchStr = function () {
        this.resetForm(document.getElementById("form-search"));
        this.showExpenses("", {});
    }

    this.filterExpenses = function (searchStr, filterObj) {
        this.showExpenses(searchStr, filterObj);
    }

    this.clearFilters = function () {
        this.resetForm(document.getElementById("form-filter"));
        this.showExpenses("", {});
    }

    this.clearView = function() {
        let view = document.getElementById("form-view");
        let length = view.children.length;

        // to index 8 because of table captions 
        for (let i = length-1; i > 8 ; i--) {
            view.removeChild(view.children[i]);
        }
    }

    this.removeExpense = function (removeButton) {

        let index = removeButton.id;
        delete this.expenses[(parseInt(index))];

        let searchForm = document.getElementById("form-search");
        let searchData = new FormData(searchForm);
        let searchStr = searchData.get('search-str');

        let filterForm = document.getElementById("form-filter");
        const filterData = new FormData(filterForm);
        let filterObj = Object.fromEntries(filterData.entries());

        this.showExpenses(searchStr, filterObj);
    }

    this.showExpenses = function (searchStr, filterObj) {
        this.clearView();
        let totalCurrencies = {};
        for (let index in this.currencies) {
            totalCurrencies[this.currencies[index]] = 0;
        }
        for (let i = 0; i < this.expenses.length; i++) {
            if (!this.isEmpty(this.expenses[i])) {
                let expense = this.expenses[i];

                if (this.containsSearchStr(expense, searchStr)) {
                    if (this.isEmpty(filterObj) || this.filtersMatch(expense, filterObj)) {
                        this.showExpense(this.expenses[i], i);
                        totalCurrencies[expense.currency] += parseFloat(this.expenses[i].totalPrice);
                    }
                }
            }
        }
        this.addViewSummary(totalCurrencies);
    }

    this.containsSearchStr = function (expense, searchStr) {
        if (expense.name.toLowerCase().includes(searchStr.toLowerCase()) ||
            expense.notes.toLowerCase().includes(searchStr.toLowerCase())) {
                return true
        } else return false;
    }

    this.isEmpty = function(filterObj) {
        if (Object.keys(filterObj).length === 0) {
            return true;
        } else return false;
    }

    this.filtersMatch = function(expense, filterObj) {
        for (let key in filterObj) {
            if (filterObj.hasOwnProperty(key)) {
                switch (key) {
                    case "method":
                    case "currency":
                    case "amount":
                    case "category": {
                        if (!this.singleFilterMatches(expense[key], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "priceFrom": {
                        if (!this.isPriceHigherThanOrEqual(expense["price"], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "priceTo": {
                        if (!this.isPriceLowerThanOrEqual(expense["price"], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "dateFrom": {
                        if (!this.isDateHigherThanOrEqual(expense["date"], filterObj[key])) {
                            console.log("CHECK THIS");
                            return false;
                        }
                        break;
                    }
                    case "dateTo": {
                        if (!this.isDateLowerThanOrEqual(expense["date"], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                }
            }   
        }
        return true;
    }

    this.singleFilterMatches = function(expenseValue, filterValue) {
        if (this.isEmpty(filterValue) || filterValue === expenseValue) {
            return true;
        } else return false;
    }

    this.isPriceHigherThanOrEqual = function (expenseValue, filterValue) {
        if (this.isEmpty(filterValue) || parseFloat(expenseValue) >= parseFloat(filterValue) ) {
            return true;
        } else return false;
    }

    this.isPriceLowerThanOrEqual = function (expenseValue, filterValue) {
        if (this.isEmpty(filterValue) || parseFloat(expenseValue) <= parseFloat(filterValue)) {
            return true;
        } else return false;
    }

    this.isDateHigherThanOrEqual = function (expenseValue, filterValue) {
        if (this.isEmpty(filterValue) || new Date(expenseValue) >= new Date(filterValue)) {
            return true;
        } else return false;
    }

    this.isDateLowerThanOrEqual = function (expenseValue, filterValue) {
        if (this.isEmpty(filterValue) || new Date(expenseValue) <= new Date(filterValue)) {
            return true;
        } else return false;
    }

    this.isEmpty = function(str) {
        if (str === undefined || str === null || str === "") {
            return true;
        } else return false;
    }

    this.addViewSummary = function(totalCurrencies) {
        let view = document.getElementById("form-view");

        let totalLabel = document.createElement("p");
        totalLabel.setAttribute("id", "total-label");
        totalLabel.textContent = "Total";

        let totalNumber = document.createElement("p");
        totalNumber.setAttribute("id", "total-number");
        
        let totalNumberStr = "";
        for (let key in totalCurrencies) {
            if (totalCurrencies[key] !== 0) {
                totalNumberStr += key + " " + totalCurrencies[key];
                totalNumberStr += "\n<br>\n";
            }
        }
        totalNumberStr = totalNumberStr.slice(0, totalNumberStr.length - 6) // remove the last <br>
        totalNumber.innerHTML = totalNumberStr;

        let emptyCell = document.createElement("p");
        emptyCell.setAttribute("class", "empty");

        view.appendChild(totalLabel);
        view.appendChild(totalNumber);
        view.appendChild(emptyCell);
    }

    this.showExpense = function(expense, index) {

        let view = document.getElementById("form-view");

        let name = document.createElement("p");
        name.textContent = expense.name;
        
        let paymentMethod = document.createElement("p");
        paymentMethod.textContent = expense.method;

        let category = document.createElement("p");
        category.textContent = expense.category;

        let date = document.createElement("p");
        date.textContent = expense.date;

        let notes = document.createElement("p");
        notes.textContent = expense.notes;

        let price = document.createElement("p");
        price.textContent = expense.currency + " " + expense.price;
        price.setAttribute("class", "number");

        let amount = document.createElement("p");
        amount.textContent = expense.amount;
        amount.setAttribute("class", "number");

        let totalPrice = document.createElement("p");
        totalPriceNumber = expense.totalPrice;
        totalPrice.textContent = expense.currency + " " + totalPriceNumber;
        totalPrice.setAttribute("class", "number");
        
        let removeButtonWrapper = document.createElement("div");
        removeButtonWrapper.setAttribute("class", "button-wrapper");

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.setAttribute("class", "button-remove");
        removeButton.setAttribute("id", index);
        

        removeButtonWrapper.appendChild(removeButton);

        view.appendChild(name);
        view.appendChild(paymentMethod);
        view.appendChild(category);
        view.appendChild(date);
        view.appendChild(notes);
        view.appendChild(price);
        view.appendChild(amount);
        view.appendChild(totalPrice);
        view.appendChild(removeButtonWrapper);
    }

    
    
    this.resetForm = function(form) {
        // clearing inputs
        let inputs = form.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            switch (inputs[i].type) {
                // case 'hidden':
                case "text":
                case "number":
                case "date": 
                    inputs[i].value = "";
                    break;
                
                case "radio":
                case "checkbox":
                    inputs[i].checked = false;
            }
        }

        // clearing selects
        let selects = form.getElementsByTagName("select");
        for (let i = 0; i < selects.length; i++)
            selects[i].selectedIndex = 0;

        // clearing textarea
        let text = form.getElementsByTagName("textarea");
        for (let i = 0; i < text.length; i++)
            text[i].innerHTML = "";

        return false;
    }
}


