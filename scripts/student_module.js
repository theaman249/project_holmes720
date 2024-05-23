var myVar;
const id_moduleSelectionArea = document.getElementById("moduleSectionArea");
let arrDeregisteredPool = [];

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

                //save the user's current year of study
                setCookie('year_of_study', data[0].year_of_study)

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
                    <div class='arrayDivModules' style = "display:flex; gap:10px; border-style:solid; padding: 8px;">

                        <span style = "display:flex; flex-direction: column">
                            <label style = "font-weight:bold">Module code</label>
                            <input type="text" value="${module_id}" style="width: 65px; margin-top: 5px;" class = 'arrayModuleCodes' readonly>
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

function getModulesForAYear(){

    console.log('getting modules...');
    const year_of_study = getCookie('year_of_study');
    const token = getCookie('jwt_token');

    if (getCookie('student_modules')) {
        //console.log("Student modules already set in the cookie:", student_modules);
        return; // Exit the function if the cookie is set
    }

    const jsonObj = {
        year_of_study:year_of_study
    }

    const jsonString = JSON.stringify(jsonObj)


    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3000/getModulesForAYear");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);

                const data = jsonResponse.data;

                console.log(data);

                setCookie('student_modules', JSON.stringify(jsonResponse)); // Store the response as a string
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

function commitDeregistration(){

    //deregisterPopUp();

    if(arrDeregisteredPool.length === 0){
        alert('Nothing to commit');
        return;
    }
    else{
        deregisterPopUp();
    }

    
}

function commitRegistration(){

    //getModules based on the student year
    getModulesForAYear();

    console.log(getStudentModulesCookieAsJsonObject());

    const chlPopUp = document.createElement('div');
    chlPopUp.id = "registrationPopUp";
    chlPopUp.style.position = "fixed"; 
    chlPopUp.style.top = "50%"; 
    chlPopUp.style.left = "50%"; 
    chlPopUp.style.transform = "translate(-50%, -50%)"; 
    chlPopUp.style.background = "white";
    chlPopUp.style.border = "1px solid #ccc";
    chlPopUp.style.padding = "10px";
    chlPopUp.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    chlPopUp.style.zIndex = "1000";
    chlPopUp.style.width = "500px";
    chlPopUp.style.height = "500px";
    // chlPopUp.style.alignItems = "center";
    // chlPopUp.style.justifyContent = "center";
    // chlPopUp.style.textAlign = "center";
    chlPopUp.style.borderRadius = "16px";

    const header = document.createElement('h2');
    header.textContent = "Enroll for a Module";

    const headerDiv = document.createElement('div');
    headerDiv.style.textAlign = "center";
    headerDiv.style.marginBottom = "32px";
    headerDiv.appendChild(header); 
    chlPopUp.appendChild(headerDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.id = "optionsDiv"; //optionsDiv has many optionDivs
    chlPopUp.appendChild(optionsDiv);


    //br
    chlPopUp.appendChild(document.createElement('br'));

    const closeBtn = document.createElement('button');
    closeBtn.innerText = "Close";
    closeBtn.className = "btn btn-success";
    closeBtn.style.marginRight = "16px";
    closeBtn.onclick = closeRegistrationPopup;
    chlPopUp.appendChild(closeBtn);

    const addButton = document.createElement('button');
    addButton.innerText = "Add";
    addButton.className = "btn btn-success";
    addButton.onclick = addOptionDiv;
    chlPopUp.appendChild(addButton);

    
    

    id_moduleSelectionArea.appendChild(chlPopUp);
}

function addOptionDiv(){
    const optionDiv = document.createElement('div');
    const id_optionsDiv = document.getElementById("optionsDiv");

    optionDiv.id = "optionDiv";
    optionDiv.className = "arrayOptionDivs";
    optionDiv.style.marginTop = "16px";
    optionDiv.innerHTML +=`
    <select id="cars" style="width: 150px; height: 30px; border: 2px solid black;">
        <option value="volvo" style="padding-left: 32px;">Volvovjhvjv</option>
        <option value="saab" style="padding-left: 15px;">Saab</option>
        <option value="opel" style="padding-left: 15px;">Opel</option>
        <option value="audi" style="padding-left: 15px;">Audi</option>
    </select></br>`

    id_optionsDiv.appendChild(optionDiv);
}

function closeRegistrationPopup(){
    id_moduleSelectionArea.removeChild(document.getElementById('registrationPopUp'))
}

function deregisterPopUp(){

    const chlPopUp = document.createElement('div');
    chlPopUp.id = "deregistrationPopUp";
    chlPopUp.style.position = "absolute";
    chlPopUp.style.top = "-50px";
    chlPopUp.style.left = "50%";
    chlPopUp.style.transform = "translateX(-50%)";
    chlPopUp.style.background = "white";
    chlPopUp.style.border = "1px solid #ccc";
    chlPopUp.style.padding = "10px";
    chlPopUp.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    chlPopUp.style.zIndex = "1000";
    chlPopUp.style.width = "300px";
    chlPopUp.style.height = "100px";
    chlPopUp.style.alignItems = "center";
    chlPopUp.style.justifyContent = "center";
    chlPopUp.style.textAlign = "center";
    
    const label = document.createElement('label');
    label.textContent = "Save Changes?";
    label.style.color = "red";
    label.style.marginBottom = "8px";
    chlPopUp.appendChild(label);

    const br = document.createElement('br');
    chlPopUp.appendChild(br);
    
    const yesButton = document.createElement('button');
    yesButton.textContent = "Yes";
    yesButton.className = "btn btn-primary";
    yesButton.type = "submit";
    yesButton.style.marginRight ="16px";
    yesButton.onclick = yesDeregistration;
    chlPopUp.appendChild(yesButton);
    
    const noButton = document.createElement('button');
    noButton.textContent = "No";
    noButton.className = "btn btn-primary";
    noButton.type = "submit";
    noButton.onclick = noDeregistration;
    chlPopUp.appendChild(noButton);

    id_moduleSelectionArea.appendChild(chlPopUp);

    // id_moduleSelectionArea.appendChild(
    // `<div style = '
    // position: absolute;
    // top: -50px;
    // left: 50%;
    // transform: translateX(-50%);
    // background: white;
    // border: 1px solid #ccc;
    // padding: 10px;
    // box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    // z-index: 1000;
    // width: 300px;
    // height: 100px;
    // align-items: center;
    // justify-content: center;
    // text-align: center; /* Center align text horizontally */
    // id = 'deregistrationPopUp'
    // '> 
    //     <label style = 'color:red; margin-bottom:8px'>Save Changes?</label><br>
    //     <button class="btn btn-primary" type="submit" onclick = "yesDeregistration()">Yes</button> <button class="btn btn-primary" type="submit" onclieck ="noDeregistration()">No</button>
    // </div>`)
}


function yesDeregistration(){

    id_moduleSelectionArea.removeChild(document.getElementById('deregistrationPopUp'));

    const id = getCookie('id');
    const token = getCookie('jwt_token');
    //alert(id + 'wants to deregister from: '+arrDeregisteredPool);

    //pop-up dissappears

    const jsonObj = {
        id:id,
        arr_modules:arrDeregisteredPool
    }

    const jsonString = JSON.stringify(jsonObj)


    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3000/deregisterModules");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            if (xhr.status === 200) {
                const jsonResponse = JSON.parse(xhr.responseText);
                
                const data = jsonResponse.data;

                console.log(data);
                id_moduleSelectionArea.innerHTML ="";
                getModulesStudentTakes();
            }
            else if(xhr.status === 401)
            {
                const jsonResponse = JSON.parse(xhr.responseText);

                alert("Failed to de-register module");
            }

        }
    };

    xhr.send(jsonString);
}

function noDeregistration(){
    id_moduleSelectionArea.removeChild(document.getElementById('deregistrationPopUp'));
}



/**
 * index: int This is the index of the selected html element
 */

const dropColorRGB = "rgb(236, 98, 98)";

function drop(index){
    const class_arrayDivModules = document.getElementsByClassName("arrayDivModules");
    const class_arrayModuleBtns = document.getElementsByClassName("arrayModuleBtns");
    const class_arrayModuleCodes = document.getElementsByClassName("arrayModuleCodes"); //inputs that contain the module codes

    if (index >= 0 && index < class_arrayDivModules.length &&  class_arrayDivModules[index].style.backgroundColor != dropColorRGB) 
    {
        class_arrayDivModules[index].style.backgroundColor = dropColorRGB;
        class_arrayModuleBtns[index].textContent = "enroll";
        class_arrayModuleBtns[index].style.backgroundColor = "green";
        arrDeregisteredPool.push(class_arrayModuleCodes[index].value);

        console.log(arrDeregisteredPool);
    } 
    else if( class_arrayDivModules[index].style.backgroundColor == dropColorRGB){
        class_arrayDivModules[index].style.backgroundColor = "white";
        class_arrayModuleBtns[index].textContent = "X";
        class_arrayModuleBtns[index].style.backgroundColor = "red";

        removeModuleFromDeregisteredPool(class_arrayModuleCodes[index].value);
        console.log(arrDeregisteredPool);
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

/**
 * 
 * @returns An array of modules in the form of data:[{Obj1},{Obj2},{Obj3}]
 */
function getStudentModulesCookieAsJsonObject() {
    const studentModulesCookie = getCookie('student_modules');
    if (studentModulesCookie) {
        try {
            const studentModulesJson = JSON.parse(studentModulesCookie);
            return studentModulesJson;
        } catch (error) {
            console.error('Failed to parse student_modules cookie:', error);
            return null;
        }
    } else {
        console.log('student_modules cookie is not set');
        return null;
    }
}

function removeModuleFromDeregisteredPool(module_id){
    //console.log('removing'+  module_id);
    const index = arrDeregisteredPool.indexOf(module_id);
    if (index !== -1) {
        arrDeregisteredPool.splice(index, 1);
    }
}