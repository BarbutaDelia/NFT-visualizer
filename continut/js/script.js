function info(){
    setInterval(date, 1000);//data
    getUrl();//url
    getLocation();//locatie
    browserInfo();//nume & versiune

    //desenez imaginea in canvas la incarcarea paginii
    let canvas = document.getElementById("desen");
    const ctx = canvas.getContext('2d');
    make_base(ctx);
    
}

function date(){
    let e = document.getElementById("date");
    e.innerHTML = new Date();
}
function getUrl(){
    let content = document.getElementById("uri");
    content.innerHTML = window.location.href;
}
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      document.getElementById("locatie").innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
      document.getElementById("location").innerHTML = "Latitudine: " + position.coords.latitude + 
      "<br>Longitudine: " + position.coords.longitude;
}
function browserInfo(){
    let content = document.getElementById("browser");
    content.innerHTML = navigator.userAgent;
}

var x = null;
var y = null;
function draw(e){
    let canvas = document.getElementById("desen");
    const ctx = canvas.getContext('2d');
    if(x == null){
        x = e.offsetX;
        y = e.offsetY;
    }
    else{
        let x2 = e.offsetX;
        let y2 = e.offsetY;
        let contur = document.getElementById("contur");
        ctx.strokeStyle = contur.value;
        let umplere = document.getElementById("umplere");   
        ctx.fillStyle = umplere.value;
        ctx.strokeRect(x, y, x2 - x, y2 - y);
        ctx.fillRect(x, y, x2 - x, y2 - y);
        x = y = null;
        
    }
}
    
function make_base(context)
{
    base_image = new Image();
    base_image.src = 'imagini/tastyBones.svg';
    base_image.onload = function(){
        context.drawImage(base_image, 0, 0);
    }
}

function insertLine(){
    var table = document.getElementById("myTable");
    var row = document.getElementById("lineNo").value;
    var culoare = document.getElementById("culoare").value;

// Create an empty <tr> element and add it to the 1st position of the table:
    var myRow = table.insertRow(row);
        
    for (i = 0; i < table.rows[0].cells.length; i++) {
        var myCell = myRow.insertCell(i);
        myCell.innerHTML = "---";
        myCell.style.background= culoare;
    }
}
function insertColumn() {
    var tbl = document.getElementById('myTable'); // table reference
    var column = document.getElementById("columnNo").value;
    let culoare = document.getElementById("culoare").value;
    let i = 0;
    // open loop for each row and append cell
    for (i = 0; i < tbl.rows.length; i++) {
        var myCell = tbl.rows[i].insertCell(column);
        myCell.innerHTML = "|";
        myCell.style.background= culoare;
    }
}

function schimbaContinut(resursa, jsFisier, jsFunctie){
    var t = null;
    if(t != null){
        clearInterval(t);
        t = null;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = 
    function(){
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            document.getElementById("continut").innerHTML = xhttp.responseText;
            if (jsFisier) {
                var elementScript = document.createElement('script');
                elementScript.onload = function () {
                    console.log("hello");
                    if (jsFunctie) {
                        window[jsFunctie]();
                    }
                };
                elementScript.src = jsFisier;
                document.head.appendChild(elementScript);
            } else {
                if (jsFunctie) {
                    window[jsFunctie]();
                }
            }
        }
    }
    xhttp.open("GET", resursa + '.html', true)
    xhttp.send();
}
//Pagina de verificare
function checkUser(){
    let username = document.getElementById("user").value
    let password = document.getElementById("pass").value
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange =
            function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    let users = JSON.parse(xhttp.responseText);
                    if(parseUsers(users, username, password))
                        document.getElementById("verifica").innerHTML = "Nume si parola corecte!";
                    else
                        document.getElementById("verifica").innerHTML = "Utilizatorul nu exista!";
                }
            }

        
        xhttp.open("GET","resurse/utilizatori.json", true);    
        xhttp.send();
    }
}
function parseUsers(users, username, password){
    let i;
    let ok = 0;
    for (i = 0; i < users.length; i++){
        if(users[i].utilizator == username && users[i].parola == password)
        ok = 1;
    }
    return ok;
}