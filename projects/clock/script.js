var currCounter = 0;

window.onload = function() {
    var standardFormat = true;

    currentTime(standardFormat, currCounter);

    document.getElementById("switch-button").addEventListener("click", () => {
        standardFormat = !standardFormat;
        let buttonMsg = "";
        if (standardFormat) {
            buttonMsg = "Switch to Military Time Format";
        } else {
            buttonMsg = "Switch to Standard Time Format";
        }
        document.getElementById("switch-button").innerHTML = buttonMsg;
        currCounter++;
        currentTime(standardFormat, currCounter);
        
    });
}

function currentTime(standardFormat, rememberedCounter) {
    
    if (currCounter === rememberedCounter) {
        let currentDate = new Date();

        document.getElementById("time").innerHTML = getTimeStr(currentDate, standardFormat);
        document.getElementById("date").innerHTML = getDateStr(currentDate, standardFormat);
    
        setTimeout(function () {
            currentTime(standardFormat, rememberedCounter);
        }, 1000);
    }
}

function getTimeStr(currentDate, standardFormat) {

    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let abbreviation = "";

    if (standardFormat) {
        if ((0 <= hours) && (hours < 12)) {
            abbreviation = "AM";
        } else {
            hours -= 12;
            abbreviation = "PM";
        }
    } else {
        if (hours < 10) hours = "0" + hours;
    }

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    let timeStr;
    if (standardFormat) {
        timeStr = hours + ":" + minutes + ":" + seconds + " " + abbreviation;
    } else {
        timeStr = hours.toString() + minutes.toString() + seconds.toString();
    }
    return timeStr;
}

function getDateStr(currentDate, standardFormat) {

    let day = currentDate.getDate();
    let month = currentDate.toLocaleDateString("default", { month: "long" });
    let year = currentDate.getFullYear();

    let dateStr = "";
    if (standardFormat) {
        dateStr = day + " " + month + " " + year;
    } else {
        if (day < 10) day = "0" + day;
        month = month.toString().slice(0, 3);
        year = year.toString().slice(2, 4);
        dateStr = day + " " + month.toLocaleUpperCase() + " " + year;
    }

    return dateStr;
}