window.onload = function() {

    var app = new App();

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

    this.expenses = [];
    
    this.addExpense = function (expenseObj) {
        expenseObj.totalPrice = +((parseFloat(expenseObj.price)*parseFloat(expenseObj.amount)).toFixed(2));
        this.expenses.push(expenseObj);
        this.resetSearchStr();
        this.resetFilters();
        this.showExpenses("", {});
    }

    this.searchExpenses = function(searchStr) {
        this.showExpenses(searchStr, {});
    }

    this.filterExpenses = function (searchStr, filterObj) {
        this.showExpenses(searchStr, filterObj);
    }

    this.clearView = function() {
        let view = document.getElementById("form-view");
        let length = view.children.length;

        // to index 8 because of table captions 
        for (let i = length-1; i > 8 ; i--) {
            view.removeChild(view.children[i]);
        }
    }

    this.showExpenses = function (searchStr, filterObj) {
        this.clearView();
        for (let i = 0; i < this.expenses.length; i++) {
            let expense = this.expenses[i];
            //let total = 0;

            if (this.containsSearchStr(expense, searchStr)) {
                if (this.isEmpty(filterObj) || this.filtersMatch(expense, filterObj)) {
                    this.showExpense(this.expenses[i]);
                    //total += this.expenses[i].totalPrice;
                    
                }
            }
        }
        this.addViewSummary();
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
                if (key === "method" || key === "currency" || key === "amount" || key === "category") {
                    if (!this.singleFilterMatches(expense[key], filterObj[key])) {
                        return false;
                    }
                }
                switch (key) {
                    case "priceFrom": {
                        let expenseKey = key.slice(0, key.length - 4);

                        if (!this.isPriceHigherThanOrEqual(expense[expenseKey], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "priceTo": {
                        let expenseKey = key.slice(0, key.length - 2);

                        if (!this.isPriceLowerThanOrEqual(expense[expenseKey], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "dateFrom": {
                        let expenseKey = key.slice(0, key.length - 4);

                        if (!this.isDateHigherThanOrEqual(expense[expenseKey], filterObj[key])) {
                            console.log("CHECK THIS");
                            return false;
                        }
                        break;
                    }
                    case "dateTo": {
                        let expenseKey = key.slice(0, key.length - 2);

                        if (!this.isDateLowerThanOrEqual(expense[expenseKey], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                }
            }   
        }
        console.log("Udalo sie");
        return true;
    }

    this.singleFilterMatches = function(expenseValue, filterValue) {
        if (filterValue === undefined || filterValue === null || filterValue === "" || filterValue === expenseValue) {
            return true;
        } else return false;
    }

    this.isPriceHigherThanOrEqual = function (expenseValue, filterValue) {
        if (filterValue === undefined || filterValue === null || filterValue === "" || parseFloat(expenseValue) >= parseFloat(filterValue) ) {
            return true;
        } else return false;
    }

    this.isPriceLowerThanOrEqual = function (expenseValue, filterValue) {
        if (filterValue === undefined || filterValue === null || filterValue === "" || parseFloat(expenseValue) <= parseFloat(filterValue)) {
            return true;
        } else return false;
    }

    this.isDateHigherThanOrEqual = function (expenseValue, filterValue) {
        if (filterValue === undefined || filterValue === null || filterValue === "" || new Date(expenseValue) >= new Date(filterValue)) {
            console.log("Hurray DATE DATE FROM, " + filterValue);
            return true;
        } else return false;
    }

    this.isDateLowerThanOrEqual = function (expenseValue, filterValue) {
        if (filterValue === undefined || filterValue === null || filterValue === "" || new Date(expenseValue) <= new Date(filterValue)) {
            console.log("Hurray DATE DATE TO, " + filterValue);
            return true;
        } else return false;
    }

    this.addViewSummary = function() {
        let view = document.getElementById("form-view");

        let totalLabel = document.createElement("p");
        totalLabel.setAttribute("id", "total-label");
        totalLabel.textContent = "Total";

        let totalNumber = document.createElement("p");
        totalNumber.setAttribute("id", "total-number");
        totalNumber.innerHTML = "3000 PLN <br> 10 GBP";

        let emptyCell = document.createElement("p");
        emptyCell.setAttribute("class", "empty");

        view.appendChild(totalLabel);
        view.appendChild(totalNumber);
        view.appendChild(emptyCell);
    }

    this.showExpense = function(expense) {

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
        totalPriceNumber = parseFloat(expense.price) * parseFloat(expense.amount);
        totalPrice.textContent = expense.currency + " " + totalPriceNumber;
        totalPrice.setAttribute("class", "number");
        
        let removeButtonWrapper = document.createElement("div");
        removeButtonWrapper.setAttribute("class", "button-wrapper");

        let removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.setAttribute("class", "button-remove");
        removeButton.setAttribute("type", "submit");

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

    this.resetSearchStr = function() {

    }

    this.resetFilters = function () {

    }

}


