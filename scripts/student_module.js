var myVar;
const id_moduleSelectionArea = document.getElementById("moduleSectionArea");

function loading(){
    console.log("loading....");
    const idLoader = document.getElementById("loader");
    const idBackgroundLoader = document.getElementById("loader-background");

    idLoader.style.display ="block";
    idBackgroundLoader.style.display ="block";

}

function unload(){
    console.log("unloading....");
    const idLoader = document.getElementById("loader");
    const idBackgroundLoader = document.getElementById("loader-background");

    idLoader.style.display ="none";
    idBackgroundLoader.style.display ="none";

}


//name of jwt toke = jwt_token
function getData(){

    const token = getCookie('jwt_token');
    const id = getCookie('id');

    const id_studentDetailsID = document.getElementById("studentDetails_id");
    const id_studentDetailsName = document.getElementById("studentDetails_name");
    const id_studentDetailsSurname = document.getElementById("studentDetails_surname");
    const id_studentDetailsYOS = document.getElementById("studentDetails_YOS");
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
                id_studentDetailsYOS.innerHTML = data[0].year_of_study;
                id_studentDetailsRole.innerHTML = data[0].role;

                getModulesStudentTakes();
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


function getModulesStudentTakes(){
    const token = getCookie('jwt_token');
    const id = getCookie('id');

    const id_moduleSelectionArea = document.getElementById("moduleSectionArea");


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

    xhr.open("POST", "http://localhost:3000/getModulesUserTakes");
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

                console.log(data);

                for(let i=0;i<data.length;++i){
                    const module_id = data[i].id;
                    const module_name = data[i].name;
                    const semester = data[i].semester;
                    const year_of_study = data[i].year_of_study;

                    console.log(module_name);

                    id_moduleSelectionArea.innerHTML += `
                    <div class='arrayDivModules' style = "display:flex; gap:10px">

                        <span style = "display:flex; flex-direction: column">
                            <label style = "font-weight:bold">Module code</label>
                            <input type="text" value="${module_id}" style="width: 65px; margin-top: 5px;" readonly>
                        </span>
                    
                        <span style = "display:flex; flex-direction: column">
                            <label style = "font-weight:bold">Module name</label>
                            <input type="text" value="${module_name}" style="width: 220px; margin-top: 5px;" readonly>
                        </span>
                    
                        <span style = "display:flex; flex-direction: column">
                            <label style = "font-weight:bold">Semester</label>
                            <input type="text" value="${semester}" style="width: 20px; margin-top: 5px;" readonly>
                        </span>

                        <span style = "display:flex; flex-direction: column">
                            <label style = "font-weight:bold; margin-bottom:4px">Drop</label>
                            <button class = 'arrayModuleBtns' onclick = drop(${i}) style = "width: 50px; background-color:red";>X</button>
                        </span>
                        
                    </div><br>
                    `;
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

/**
 * index: int This is the index of the selected html element
 */

function drop(index){
    const class_arrayDivModules = document.getElementsByClassName("arrayDivModules");
    const class_arrayModuleBtns = document.getElementsByClassName("arrayModuleBtns");

    if (index >= 0 && index < class_arrayDivModules.length &&  class_arrayDivModules[index].style.backgroundColor != "red") 
    {
        class_arrayDivModules[index].style.backgroundColor = "red";
        class_arrayModuleBtns[index].textContent = "enroll";
        class_arrayModuleBtns[index].style.backgroundColor = "green";
    } 
    else if( class_arrayDivModules[index].style.backgroundColor == "red"){
        class_arrayDivModules[index].style.backgroundColor = "white";
        class_arrayModuleBtns[index].textContent = "X";
        class_arrayModuleBtns[index].style.backgroundColor = "red";
    }
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