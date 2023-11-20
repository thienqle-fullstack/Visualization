//Get data from form
function getFormData(formID){
    //Add a same class to all input so we can get it out
    let formArray = document.getElementsByClassName(formID);
    let payload = {}
    Array.from(formArray).forEach((elem)=> {
        payload[elem.id] = elem.value
    })
    return payload;
}

function resetForm(formID){
    let formArray = document.getElementsByClassName(formID);
    Array.from(formArray).forEach((elem)=> {
        elem.value = 0;
    })
}

//Add timestampt to datea
function addCurrentDateTime(payload){

    let datetime = new Date();
    payload['id'] = datetime.toString();
    payload['date'] = datetime.getMonth() +  "/" + datetime.getDate() + "/" + datetime.getFullYear(); 
    payload['time'] = datetime.getHours() + ":" + datetime.getMinutes();
}

//Combine to function above (get form data and add the date)
function getFormDataWithTimestampt(formID){
    let payload = getFormData(formID)
    addCurrentDateTime(payload)
    return payload
}

var endpoint = "https://script.google.com/macros/s/AKfycby9M6469oFtl8Hn5l0jJxvBjSEW2QZAACKNVysDayv-A8ywhyRXj6vryb5EMiaxmiXC/exec"


function createOne(data){
    let xhr = new XMLHttpRequest();
    xhr.timeout = 10000;

    strRequest = endpoint + "?";
    let keys = Object.keys(data);
    for(let i=0;i<keys.length;i++){
        strRequest += keys[i] + "=" + data[keys[i]]
        if(i<keys.length - 1) {
            strRequest+="&";
        }
    } 

    let url = new URL(strRequest);
    xhr.open('GET', url);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) { 
        alert(`Error ${xhr.status}: ${xhr.statusText}`); 

        } else { 
            alert('Successfully submitted data!');
            resetForm('my-data');
        }
    };   
}

/* GET ALL */
function getAverage(){
    // This is your connection point to backend
    let xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    let url = new URL(endpoint);
    xhr.open('GET', url);
    xhr.send();
    let output = '';
    xhr.onload = function() {
        if (xhr.status != 200) { 
        alert(`Error ${xhr.status}: ${xhr.statusText}`); 

        } else { 
            //xhr.response is the result body
            data = JSON.parse(xhr.response)
            alert(data['stats'])
        }
    };
        
}