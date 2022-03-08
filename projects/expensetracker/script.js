window.onload = function() {

    var app = new App();

    app.init();

    let formAdd = document.getElementById("form-add");
    let formSearch = document.getElementById("form-search");
    let formFilter = document.getElementById("form-filter");

    formAdd.addEventListener("submit", (e) => {
        let expenseObj = createObjFromFormEntries(e); // todo
        app.addExpense(expenseObj);

        app.showExpenses("", {});

        app.updateSummaryCurrency(expenseObj.currency);
        app.showSummary(expenseObj.currency);
    });
    formSearch.addEventListener("submit", (e) => { 
        let searchStr = getSearchStr(e);
        let filterObj = createFilterObj(); // todo
        app.showExpenses(searchStr, filterObj);
     });
    formFilter.addEventListener("submit", (e) => { 
        let filterObj = createObjFromFormEntries(e);
        let searchStr = document.getElementById("search-str").value;
        app.showExpenses(searchStr, filterObj);
     });

    let buttonSearchClear = document.getElementById("button-search-clear");
    let buttonFilterClear = document.getElementById("button-filter-clear");
    
    buttonSearchClear.addEventListener("click", (e) => {
        e.preventDefault();
        app.clearSearchStr();
        let filterObj = createFilterObj();
        app.showExpenses("", filterObj);
    });

    buttonFilterClear.addEventListener("click", (e) => {
        e.preventDefault();
        app.clearFilters();
        let searchStr = document.getElementById("search-str").value;
        app.showExpenses(searchStr, {});
    });

    let formView = document.getElementById("form-view"); 
    formView.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("button-remove")) {
            
            let index = e.target.id;
            let currency = app.expenses[(parseInt(index))].currency;
            app.removeExpense(e.target);
            
            let searchStr = document.getElementById("search-str").value;
            let filterObj = createFilterObj();

            app.showExpenses(searchStr, filterObj);

            app.updateSummaryCurrency(currency);
            app.showSummary(currency);
        }
    })

    let summaryCurrency = document.getElementById("summary-currency");
    summaryCurrency.addEventListener("change", (e) => {
        let currency = getSummaryCurrency(e);
        app.showSummary(currency);
    });

    function createObjFromFormEntries(e) {
        e.preventDefault();
        let data = new FormData(e.target);
        return Object.fromEntries(data.entries());
    }

    function createFilterObj() {
        let data = new FormData(document.getElementById("form-filter"));
        return Object.fromEntries(data.entries());
    }

    function getSearchStr(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        return data.get('search-str');
    }

    function getSummaryCurrency(e) {
        e.preventDefault();
        return e.target.value;
    }
}

var App = function() {

    this.currencies = [ "PLN", "GBP", "USD", "EUR" ];
    this.paymentMethods = [ "Cash", "Debit Card", "Credit Card", "Bank Transfer" ];
    this.categories = [ "Housing", "Groceries", "Dining Out", "Personal Care", "Transportation", "Health Care", 
        "Entertainment", "Child Care", "Pet Care", "Miscellaneous" ];
    
    this.expenses = [];
    
    this.init = function() {
        this.setDateRange();
    }

    this.setDateRange = function() {
        
        let date = new Date();
        let y = date.getFullYear();
        let yTwoYearsAgo = date.getFullYear() - 2;
        let m = date.getMonth() + 1;
        let d = date.getDate();
        if (m < 10)
            m = '0' + m.toString();
        if (d < 10)
            d = '0' + d.toString();

        let minDate = yTwoYearsAgo + '-' + m + '-' + d;
        let maxDate = y + '-' + m + '-' + d;

        document.getElementById("date").setAttribute("min", minDate);
        document.getElementById("date").setAttribute("max", maxDate);

        document.getElementById("filter-date-from").setAttribute("min", minDate);
        document.getElementById("filter-date-from").setAttribute("max", maxDate);

        document.getElementById("filter-date-to").setAttribute("min", minDate);
        document.getElementById("filter-date-to").setAttribute("max", maxDate);
    }

    this.addExpense = function (expenseObj) {
        expenseObj.totalPrice = +((parseFloat(expenseObj.price)*parseFloat(expenseObj.amount)).toFixed(2));
        this.expenses.push(expenseObj);

        this.clearAddForm();
        this.resetForm(document.getElementById("form-search"));
        this.resetForm(document.getElementById("form-filter"));
    }

    this.clearAddForm = function() {
        this.resetForm(document.getElementById("form-add"));
        document.getElementById("amount").value = 1;
    }

    this.clearSearchStr = function () {
        this.resetForm(document.getElementById("form-search"));
    }

    this.clearFilters = function () {
        this.resetForm(document.getElementById("form-filter"));
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
                    if (this.hasNoProperties(filterObj) || this.filtersMatch(expense, filterObj)) {
                        this.showExpenseRow(this.expenses[i], i);
                        totalCurrencies[expense.currency] += parseFloat(this.expenses[i].totalPrice);
                        totalCurrencies[expense.currency] = +(totalCurrencies[expense.currency].toFixed(2));
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

    this.hasNoProperties = function(filterObj) {
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
                        if (!this.isPriceHigherThanOrEqual(expense["totalPrice"], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "priceTo": {
                        if (!this.isPriceLowerThanOrEqual(expense["totalPrice"], filterObj[key])) {
                            return false;
                        }
                        break;
                    }
                    case "dateFrom": {
                        if (!this.isDateHigherThanOrEqual(expense["date"], filterObj[key])) {
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
                totalNumberStr += key + " " + this.floatWithComas(totalCurrencies[key]);
                totalNumberStr += "\n<br>\n";
            }
        }
        totalNumberStr = totalNumberStr.slice(0, totalNumberStr.length - 6) // remove the last <br>
        totalNumber.innerHTML = totalNumberStr;

        let emptyCell = document.createElement("div");
        emptyCell.setAttribute("class", "empty");

        view.appendChild(totalLabel);
        view.appendChild(totalNumber);
        view.appendChild(emptyCell);
    }

    this.showExpenseRow = function(expense, index) {

        let view = document.getElementById("form-view");

        let name = document.createElement("p");
        name.textContent = expense.name;
        name.setAttribute("class", "p-name");
        
        let paymentMethod = document.createElement("p");
        paymentMethod.textContent = expense.method;
        paymentMethod.setAttribute("class", "p-method");

        let category = document.createElement("p");
        category.textContent = expense.category;
        category.setAttribute("class", "p-category");

        let date = document.createElement("p");
        date.textContent = expense.date;
        date.setAttribute("class", "p-date");

        let notes = document.createElement("p");
        notes.textContent = expense.notes;
        notes.setAttribute("class", "p-notes");

        let price = document.createElement("p");
        price.textContent = expense.currency + " " + this.floatWithComas(expense.price);
        price.setAttribute("class", "p-price number");

        let amount = document.createElement("p");
        amount.textContent = this.intWithComas(expense.amount);
        amount.setAttribute("class", "p-amount number");

        let totalPrice = document.createElement("p");
        totalPriceNumber = expense.totalPrice;
        totalPrice.textContent = expense.currency + " " + this.floatWithComas(totalPriceNumber);
        totalPrice.setAttribute("class", "p-total-price number");
        
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

    this.floatWithComas = function(number) {
        let str = parseFloat(number).toFixed(2);
        let strWithComas = "";
        for (let i = str.length - 1; i >= 0; i--) {
            strWithComas = str[i] + strWithComas;
            if (i < str.length - 5 && ((str.length - i) % 3) === 0 && i !== 0) {
                strWithComas = "," + strWithComas;
            }
        }
        return strWithComas;
    }

    this.intWithComas = function (number) {
        let str = parseFloat(number).toFixed(0);
        let strWithComas = "";
        for (let i = str.length - 1; i >= 0; i--) {
            strWithComas = str[i] + strWithComas;
            if (i < str.length - 2 && ((str.length - i) % 3) === 0 && i !== 0) {
                strWithComas = "," + strWithComas;
            }
        }
        return strWithComas;
    }


    this.showSummary = function(currency) {

        this.clearSummary();

        let totalByCategory = this.calculateTotalByCategory(currency);
        let sum = this.calculateSum(totalByCategory);

        let summary = document.getElementById("div-summary");
        
        this.addCategoryRow(currency, "undefined", totalByCategory, sum);

        for (let index in this.categories) {
            let category = this.categories[index];
            
            this.addCategoryRow(currency, category, totalByCategory, sum);
        }
    }

    this.addCategoryRow = function (currency, category, totalByCategory, sum) {
        let categoryElement = document.createElement("p");
        if (category === "undefined") {
            categoryElement.textContent = "";
        } else categoryElement.textContent = category;

        let expensesElement = document.createElement("p");
        expensesElement.textContent = currency + " " + this.floatWithComas(totalByCategory[category]);
        expensesElement.setAttribute("class", "number");

        let percentageElement = document.createElement("p");
        if (sum !== 0) {
            percentageElement.textContent = (+((totalByCategory[category] * 100 / sum).toFixed(2))) + "%";
        } else percentageElement.textContent = "0%";
        percentageElement.setAttribute("class", "number");

        let summary = document.getElementById("div-summary");
        summary.appendChild(categoryElement);
        summary.appendChild(expensesElement);
        summary.appendChild(percentageElement);
    }

    this.calculateTotalByCategory = function (currency) {
        let totalByCategory = {};
        for (let index in this.categories) {
            totalByCategory[this.categories[index]] = 0;
        }
        totalByCategory.undefined = 0;

        for (let i = 0; i < this.expenses.length; i++) {
            if (!this.isEmpty(this.expenses[i])) {
                let expense = this.expenses[i];
                if (expense.currency === currency) {
                    totalByCategory[expense.category] += expense.totalPrice;
                    totalByCategory[expense.category] = +(totalByCategory[expense.category].toFixed(2));
                }
            }
        }
        return totalByCategory;
    }

    this.calculateSum = function (totalByCategory) {
        let sum = 0;
        for (let index in totalByCategory) {
            sum += +(totalByCategory[index].toFixed(2));
        }
        sum = +(sum.toFixed(2));
        return sum;
    }
    
    this.clearSummary = function () {
        let summary = document.getElementById("div-summary");
        let length = summary.children.length;

        // to index 8 because of table captions 
        for (let i = length - 1; i > 2; i--) {
            summary.removeChild(summary.children[i]);
        }
    }
    
    this.updateSummaryCurrency = function(currency) {
        let summaryCurrency = document.getElementById("summary-currency");
        let length = summaryCurrency.children.length;

        for (let i = 0; i < length; i++) {
            let option = summaryCurrency.children[i];
            if (option.value !== currency) {
                option.removeAttribute("selected");
            } else option.setAttribute("selected", "selected");
        }
    }

    this.resetForm = function(form) {
        // clearing inputs
        let inputs = form.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            switch (inputs[i].type) {
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


