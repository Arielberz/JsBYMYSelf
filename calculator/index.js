const disply = document.getElementById("display");

function appendToDisplay(input) {
    disply.value += input;
}

function clearDisplay() {
    disply.value = "";
}

function calculateResult() {
    try {
        disply.value = eval(disply.value);
    } catch (error) {
        disply.value = "Error";
    }
}