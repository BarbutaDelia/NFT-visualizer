function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    var xhttp = new XMLHttpRequest();
  
    var obj = new Object();
    obj.utilizator = username;
    obj.parola = password;
    let jsonStr = JSON.stringify(obj);
    console.log(jsonStr)
  
    xhttp.open("POST", "/api/utilizatori", true);
    xhttp.send(jsonStr);
  }