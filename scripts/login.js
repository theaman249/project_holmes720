const loginStudentNumber = document.getElementById("id_logStudentNumberInput");
const loginPassword = document.getElementById("id_logPasswordInput");

function test(){
    console.log("testing in login page");
}


function login(){

    const successOut = document.getElementById("id_logSuccessOut");
    successOut.innerHTML = "logging in....";
    const id = document.getElementById("id_logStudentNumberInput").value;

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
                successOut.innerHTML = "";

                const jsonResponse = JSON.parse(xhr.responseText);

                const jwtToken = jsonResponse.jwt_token;

                console.log(jsonResponse.payload.role);
                
                alert('Welcome!');
                
                
                //set the JWT cookie
                setCookie("jwt_token",jwtToken);
                setCookie("id",id);

                if(jsonResponse.payload.role === 'student'){
                    window.location.replace("student_module_management.html");
                }
                else{
                    window.location.replace("admin_dashboard.html");
                }
                

                
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

function setCookie(name, value) {
    var expirationDate = new Date();
    // Set the expiration date to 1 day from the current date
    expirationDate.setDate(expirationDate.getDate() + 1);
  
    var cookieString = name + '=' + encodeURIComponent(value) + '; expires=' + expirationDate.toUTCString() + '; path=/';
  
    document.cookie = cookieString;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}


document.getElementById("loginForm").addEventListener("submit", function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    this.reset();
});

