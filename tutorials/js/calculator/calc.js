window.onload = function() {
    console.log("App started");
    calculator.init();
};

let calculator = {
    buttons: undefined,
    input: undefined, 

    init: function () {
        this.buttons = document.querySelectorAll(".numbers button, .operators button");
        this.input = document.getElementById("input");

        for (let i = 0; i < this.buttons.length; i++) {
            let element = this.buttons[i];
            element.addEventListener("click", this.buttonClick);
            
        }
    }, 

    buttonClick: function(e) {

        let divHtmlText = e.target.innerHTML;
        console.log("click: " + divHtmlText);

        switch(divHtmlText) {
            case "=": 
                calculator.evaluate();
            break;
            case "c":
                calculator.clear();
            break;
            default: 
                calculator.addToInput(divHtmlText);
            break;
        }
    },

    addToInput: function(str) {
        if (calculator.input.value === "0") {
            if(
                str === "." ||
                str === "+" ||
                str === "-" ||
                str === "*" ||
                str === "/" ) {
                this.appendInput(str);
            } else if (str !== "00") {
                this.setInput(str);
            }
        } else {
            this.appendInput(str);
        }
    }, 

    clear: function() {
        this.setInput("0");
    },

    evaluate: function() {
        let result = math.evaluate(calculator.input.value);
        this.setInput(result);
    },

    setInput: function(str) {
        calculator.input.value = str;
    },

    appendInput: function(str) {
        calculator.input.value +=str;
    }
};