const studentNumber = document.getElementById("id_studentNumberInput");
const email = document.getElementById("id_emailInput");
const password = document.getElementById("id_passwordInput");
const fname = document.getElementById("id_nameInput");
const lname = document.getElementById("id_surnameInput");
const passwordConfirm = document.getElementById("id_passwordConfirmationInput");
const YOS = document.getElementById("id_yearOfStudyInput");

const studentNumberRegex = /^[up]\d{8}$/;
const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passLengthPattern = /^.{8,}$/;
const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const uppercaseRegex = /[A-Z]/;
const digitRegex = /\d/;

const btnRegister = document.getElementById("id_btnRegister");

var validStdNumer = false;
var validEmail = false;
var validPassword = false;
var validConfirmPassword = false;

const url = "http://localhost:3000/register";

studentNumber.addEventListener("input", function(event){
    const stdOut = document.getElementById("id_stdOut");

    if(event.target.value.match(studentNumberRegex)){
        stdOut.innerHTML = "";
        validStdNumer = true;
    }
    else{
        stdOut.innerHTML = "not valid Student Number";
        validStdNumer = false;
    }

});


email.addEventListener("input", function(event){
    const emailOut = document.getElementById("id_emailOut");

    if(event.target.value.match(emailRegex)){
        emailOut.innerHTML = "";
        validEmail = true;
    }
    else{
        emailOut.innerHTML = "not valid email address";
        validEmail = false;
    }
});



password.addEventListener("input", function(event){
    const passOut = document.getElementById("id_passwordOut");

    //password policy

    if(!event.target.value.match(passLengthPattern)){
        passOut.innerHTML = "minimum of 8 characters required";
        validPassword = false;
    }
    else if(!event.target.value.match(uppercaseRegex)){
        passOut.innerHTML = "password must have at least one uppercase character";
        validPassword = false;
    }
    else if(!event.target.value.match(digitRegex)){
        passOut.innerHTML = "password must have at least one digit value";
        validPassword = false;
    }
    else if(!event.target.value.match(specialCharacterRegex)){
        passOut.innerHTML = "password must have at least one special character";
        validPassword = false;
    }
    else{
        passOut.innerHTML = "";
        validPassword = true;
    }
});

passwordConfirm.addEventListener("input", function(event){

    const passOut = document.getElementById("id_passwordConfirmationOut");

    if(event.target.value !== password.value){
        passOut.innerHTML = "passwords do not match";
        validConfirmPassword = false;
    }
    else{
        passOut.innerHTML = "";
        validConfirmPassword = true;
    }
});

function isValidNameAndSurname(){
    const name = document.getElementById("id_nameInput");
    const surname = document.getElementById("id_surnameInput");

    if(name.value.length === 0 && surname.value.length === 0){
        return true; //is empty
    }
    else{
        return false; //isn't empty
    }
}

function isValidYear(){
    const YOS = document.getElementById("id_yearOfStudyInput");

    if(YOS.value === ""){
        return true; //is empty
    }
    else{
        return false; //isn't empty
    }
}


btnRegister.addEventListener("click", function(event){

    const successOut = document.getElementById("id_successOut");
    
    if(!validStdNumer || !validEmail || !validConfirmPassword || !validPassword || isValidNameAndSurname() || isValidYear()){
        alert('Unable to submit. Some Information was wrong');
    }
    else{
        successOut.innerHTML = "submitting user details....";

        const jsonObj={
            id: studentNumber.value,
            fname: fname.value,
            lname: lname.value,
            email: email.value,
            password: password.value,
            year_of_study: YOS.value,
        }

        const jsonString = JSON.stringify(jsonObj);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
                
        //this will subscribe to the onreadystatechange
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);

                if (xhr.status === 201) {
                    successOut.innerHTML = "Done!";
                }   
            }
        };

        xhr.send(jsonString);
    }
});












