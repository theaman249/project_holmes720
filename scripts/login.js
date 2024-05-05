const loginStudentNumber = document.getElementById("id_logStudentNumberInput");
const loginPassword = document.getElementById("id_logPasswordInput");

function test(){
    console.log("testing in login page");
}


function login(){

    const successOut = document.getElementById("id_logSuccessOut");
    successOut.innerHTML = "logging in....";

    const jsonObj={
        id: loginStudentNumber.value,
        password: loginPassword.value,
    }

    const jsonString = JSON.stringify(jsonObj);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/login");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
            
    //this will subscribe to the onreadystatechange
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);

            if (xhr.status === 200) {
                alert('Welcome!');
                successOut.innerHTML = "";
                window.location.replace("student_module_management.html");
            } 
            else if(xhr.status === 401){
                alert('Incorrect username or password provided');
                successOut.innerHTML = "";
            }   
            else{
                alert('Oops...Something went wrong');
                successOut.innerHTML = "";
            }
        }
    };

    xhr.send(jsonString);
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    this.reset();
});

