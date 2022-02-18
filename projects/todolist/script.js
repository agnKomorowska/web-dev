window.onload = function() {
    
    let app = new App(); 

    // add event listeners for user input
    let input = document.getElementById("input-text");
    input.addEventListener("keydown", (e) => {
        if (e.code === 'Enter') {
            validateAndAddItem(input);
        }
    });

    let button = document.getElementById("add-button");
    button.addEventListener("click", () => validateAndAddItem(input));

    let validateAndAddItem = function(input) {
        if (isNotEmpty(input.value.trim())) {
            let item = app.createItem(input.value);
            addNewHtmlElement(item);
            document.getElementById("input-text").value = "";
        } 
    }

    let isNotEmpty = function (str) {
        if (str === "") {
            alert("This field must not be empty");
            return false;
        } else return true;
    }

    // add event listener for item icons
    let list = document.getElementById("list");
    list.addEventListener("click", (e) => {

        let icon = e.target;
        let itemBox = e.target.parentNode.parentNode;
        let note = itemBox.children[1].children[0];
        
        // delete icon
        if (e.target.classList.contains("fa-trash-can")) {
            list.removeChild(itemBox);
        } 
        // check icon
        else if (e.target.classList.contains("fa-square")) {
            itemBox.classList.add("item-done");
            note.classList.add("item-done");
            icon.classList.remove("fa-square");
            icon.classList.add("fa-square-check");
        } 
        // uncheck icon
        else if (e.target.classList.contains("fa-square-check")) {
            itemBox.classList.remove("item-done");
            note.classList.remove("item-done");
            icon.classList.remove("fa-square-check");
            icon.classList.add("fa-square");
        } 
        // move up icon
        else if (e.target.classList.contains("fa-arrow-up")) {
            let siblingItem = itemBox.previousElementSibling;

            if (siblingItem !== null) {
                let removedItem = list.removeChild(itemBox);
                list.insertBefore(removedItem, siblingItem);
            }
        } 
        // move down icon
        else if (e.target.classList.contains("fa-arrow-down")) {
            let siblingItem = itemBox.nextElementSibling;

            if (siblingItem !== null) {
                let removedItem = list.removeChild(siblingItem);
                list.insertBefore(removedItem, itemBox);
            }
        } 
        // edit icon
        else if (e.target.classList.contains("fa-pen")) {
            note.removeAttribute("readonly");
            note.focus();
        }
    }
    );

    // add event listener for item notes
    list.addEventListener("focusout", (e) => {
        if (e.target.classList.contains("item-note-value")) {
            e.target.setAttribute("readonly", false);
        }
    }
    );

    // define adding new HTML element
    let addNewHtmlElement = function (item) {

        // create the icon on the left
        let iconLeftDiv = document.createElement("div");
        iconLeftDiv.classList.add("icon-left");

        let iconCheckbox = document.createElement("i");
        iconCheckbox.classList.add("fa-solid");
        iconCheckbox.classList.add("fa-square");

        iconLeftDiv.appendChild(iconCheckbox);

        // create item note
        let itemNoteDiv = document.createElement("div");
        itemNoteDiv.classList.add("item-note");

        let itemNote = document.createElement("input");
        itemNote.classList.add("item-note-value");
        itemNote.setAttribute("type", "text");
        itemNote.setAttribute("value", item.note);
        itemNote.setAttribute("readOnly", "true");
        itemNoteDiv.appendChild(itemNote);

        // create item date
        let itemDateDiv = document.createElement("div");
        itemDateDiv.classList.add("item-date");

        let time = document.createElement("p");
        let date = document.createElement("p");
        time.appendChild(document.createTextNode(item.time));
        date.appendChild(document.createTextNode(item.date));
        itemDateDiv.appendChild(time);
        itemDateDiv.appendChild(date);

        // create icons on the right 
        let iconsRightDiv = document.createElement("div");
        iconsRightDiv.classList.add("icons-right");

        let iconUp = document.createElement("i");
        iconUp.classList.add("fa-solid");
        iconUp.classList.add("fa-arrow-up");
        let iconDown = document.createElement("i");
        iconDown.classList.add("fa-solid");
        iconDown.classList.add("fa-arrow-down");
        let iconEdit = document.createElement("i");
        iconEdit.classList.add("fa-solid");
        iconEdit.classList.add("fa-pen");
        let iconDelete = document.createElement("i");
        iconDelete.classList.add("fa-solid");
        iconDelete.classList.add("fa-trash-can");

        iconsRightDiv.appendChild(iconUp);
        iconsRightDiv.appendChild(iconDown);
        iconsRightDiv.appendChild(iconEdit);
        iconsRightDiv.appendChild(iconDelete);

        // create item-box 
        // append elements to the item-box
        let itemBox = document.createElement("div");
        itemBox.classList.add("item-box");

        itemBox.appendChild(iconLeftDiv);
        itemBox.appendChild(itemNoteDiv);
        itemBox.appendChild(itemDateDiv);
        itemBox.appendChild(iconsRightDiv);

        // append the item box to the list
        var list = document.getElementById("list");
        list.appendChild(itemBox);

    }
}

let App = function() {

    let parent = this;

    let Item = function(note) {
        this.note = note;
        let date = new Date();
        
        this.time = parent.addZeroPrefix(date.getHours()) + ":" + parent.addZeroPrefix(date.getMinutes());
        this.date = parent.addZeroPrefix(date.getDay()) + "/" + parent.addZeroPrefix(date.getMonth()) + "/" + date.getFullYear();
    }

    this.addZeroPrefix = function (str) {
        if (str < 10) return "0" + str;
        return str;
    }

    // workaround due to error "app.Item is not a constructor" 
    // when new Item() is called in window.onload()
    this.createItem = function(note) {
        let item = new Item(note);
        return item;
    }
}


