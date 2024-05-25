function getAdminData(){

    const token = getCookie('admin_jwt_token');
    const id = getCookie('admin_id');

    loading();

    const id_studentDetailsID = document.getElementById("studentDetails_id");
    const id_studentDetailsName = document.getElementById("studentDetails_name");
    const id_studentDetailsSurname = document.getElementById("studentDetails_surname");
    const id_studentDetailsRole = document.getElementById("studentDetails_role");
    const id_studentDetailsEmail = document.getElementById("studentDetails_email");


    // Check if token exists
    if (!token) {
      alert('WARNING: Unable to get JWT Token cookie');
      return;
    }
    else if(!id){
        alert('WARNING: Unable to get id cookie');
        return;
    }

    const jsonObj = {
        id:id
    }

    const jsonString = JSON.stringify(jsonObj)


    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3000/getUserData");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                console.log(data[0]);
                unload();
                
                id_studentDetailsID.innerHTML = data[0].id;
                id_studentDetailsName.innerHTML = data[0].name;
                id_studentDetailsSurname.innerHTML = data[0].surname;
                id_studentDetailsEmail.innerHTML = data[0].email
                id_studentDetailsRole.innerHTML = data[0].role;
            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert(jsonResponse);
            }

        }
    };

    xhr.send(jsonString);
}

function getAdminData(){

    const token = getCookie('admin_jwt_token');
    const id = getCookie('admin_id');

    loading();

    const id_studentDetailsID = document.getElementById("studentDetails_id");
    const id_studentDetailsName = document.getElementById("studentDetails_name");
    const id_studentDetailsSurname = document.getElementById("studentDetails_surname");
    const id_studentDetailsRole = document.getElementById("studentDetails_role");
    const id_studentDetailsEmail = document.getElementById("studentDetails_email");


    // Check if token exists
    if (!token) {
      alert('WARNING: Unable to get JWT Token cookie');
      return;
    }
    else if(!id){
        alert('WARNING: Unable to get id cookie');
        return;
    }

    const jsonObj = {
        id:id
    }

    const jsonString = JSON.stringify(jsonObj)


    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3000/getUserData");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                console.log(data[0]);
                unload();
                
                id_studentDetailsID.innerHTML = data[0].id;
                id_studentDetailsName.innerHTML = data[0].name;
                id_studentDetailsSurname.innerHTML = data[0].surname;
                id_studentDetailsEmail.innerHTML = data[0].email
                id_studentDetailsRole.innerHTML = data[0].role;

                //getLogData();
            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert(jsonResponse);
            }

        }
    };

    xhr.send(jsonString);
}

function test(){
    const id_lblLoading = document.getElementById("lblLoading").innerHTML = 'test';
}


function getLogData(){

    const id = getCookie('admin_id');
    const token = getCookie('jwt_token');

    const student_id = document.getElementById("inStudentNuber").value;
    const resultCount = Number(document.getElementById("inNumResults_esg").value);
    const id_lblLoading = document.getElementById("lblLoading");
    const id_textAreaOut = document.getElementById("textAreaOut");

    id_lblLoading.style.color = 'green';
    id_lblLoading.innerHTML = "Fetching Data....."

    //clearTextArea
    id_textAreaOut.innerHTML = "";

    const jsonObj = {
        result_count: resultCount,
        stu_id:student_id,
        admin_id:id
    }

    const jsonString = JSON.stringify(jsonObj)

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3000/getLogData");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {

                id_lblLoading.innerHTML = "";

                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                for(let i=0; i<data.length; ++i)
                {
                    id_textAreaOut.innerHTML += `{student_id: ${data[i].id}, action: ${data[i].action}, timestamp: ${data[i].timestamp}}\n`;
                }
            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert(jsonResponse);
            }

        }
    };

    xhr.send(jsonString);
}



function logout(){

    const token = getCookie('admin_jwt_token');
    const id = getCookie('admin_id');

    const jsonObj = {
        id:id,
        action:"logout"
    }

    const jsonString = JSON.stringify(jsonObj)

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3000/remoteWriteLog");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            //console.log(xhr.status);
            //console.log(xhr.responseText);

            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                //delete all cookies related to the student
                deleteCookie('admin_jwt_token');
                deleteCookie('admin_id');

                //go back to the login page
                window.location.replace("login.html");

            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert(jsonResponse);
            }

        }
    };

    xhr.send(jsonString);
}


function unload(){
    console.log("unloading....");
    const idLoader = document.getElementById("loader");
    const idBackgroundLoader = document.getElementById("loader-background");

    idLoader.style.display ="none";
    idBackgroundLoader.style.display ="none";

}

function loading(){
    console.log("loading....");
    const idLoader = document.getElementById("loader");
    const idBackgroundLoader = document.getElementById("loader-background");

    idLoader.style.display ="block";
    idBackgroundLoader.style.display ="block";

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

function deleteCookie(cookieName) {
    // Set the cookie's expiration date to a past date
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
