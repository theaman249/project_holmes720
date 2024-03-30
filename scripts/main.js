const studentNumber = document.getElementById("id_passwordInput");
const numberRegex = /^[0-9]+$/;



studentNumber.addEventListener("input", function(event){
    const stdOut = document.getElementById("id_stdOut");

    if(event.target.value.match(numberRegex)){
        stdOut.innerHTML = "";
    }
    else{
        stdOut.innerHTML = "Not valid Student Number";
    }

});