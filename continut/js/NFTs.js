function incarcaNFTs(){
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange =
            function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    printTable(this)
                }
            }

        
        xhttp.open("GET","resurse/NFTs.xml", true);    
        xhttp.send();
    }
}
function printTable(xml){
    insertTable();
    table = document.getElementById("MainTable").getElementsByTagName('tbody')[0];
    var x, xmlDoc, i;
    xmlDoc = xml.responseXML;
    x = xmlDoc.getElementsByTagName("NFT");
    for (i = 0; i< x.length; i++) {
        var row = table.insertRow(i);
        cell = row.insertCell(0);
        cell.innerHTML = x[i].getElementsByTagName('name')[0].textContent
        cell = row.insertCell(1);
        cell.innerHTML = x[i].getElementsByTagName('price')[0].textContent
        cell = row.insertCell(2);
        cell.innerHTML = x[i].getElementsByTagName('rank')[0].textContent
        cell = row.insertCell(3);
        cell.innerHTML = x[i].getElementsByTagName('properties')[0].getElementsByTagName('headwear')[0].textContent
        cell = row.insertCell(4);
        cell.innerHTML =  x[i].getElementsByTagName('properties')[0].getElementsByTagName('body')[0].textContent
        cell = row.insertCell(5);
        cell.innerHTML = x[i].getElementsByTagName('properties')[0].getElementsByTagName('background')[0].textContent
        cell = row.insertCell(6);
        cell.innerHTML = x[i].getElementsByTagName('properties')[0].getElementsByTagName('type')[0].textContent
    }
}
function insertTable(){
    document.getElementById("continut").innerHTML='<table id="MainTable">'+
    '<thead>' +
        '<tr>' +
            '<th rowspan="2">Nume</th>' +
            '<th rowspan="2">Preț</th>' +
            '<th rowspan="2">Rang</th>' +
            '<th colspan="4">Proprietăți</th>' +
        '</tr>' +
        '<tr>' +
            '<th>Cască</th>' +
            '<th>Armură</th>' +
            '<th>Fundal</th>' +
            '<th>Tip</th>' +
        '</tr>' +
    '</thead>' +
    '<tbody id="BodyRows">' +
    '</tbody>' +
'</table>';
}