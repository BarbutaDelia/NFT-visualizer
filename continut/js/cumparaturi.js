window.indexedDB.deleteDatabase("database2");
var numberOfProducts = 0;
class Product {
    constructor(name, quantity) {
      this.name = name;
      this.quantity = quantity;
    }
}
class ProductWthId{
    constructor(id, name, quantity) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
    }
}
class SaveData{
    constructor(name, quantity){
        this.product = new Product(name, quantity);
    }
    save(){};
}
class LocalStorage extends SaveData{
    constructor(name, quantity){
        super(name, quantity);
    }
    save(){
        let n = localStorage.getItem("nr");
        if(n == null)
            n = 0;
        else
            n = parseInt(n);
        let p = new Product(this.product.name, this.product.quantity);
        n++;
        localStorage.setItem("nr", n);
        localStorage.setItem(n, JSON.stringify(p));
        }
    
    
    show(){
        let i;
        let table = document.getElementById("shopping");
        let cell;

        var n = localStorage.getItem("nr");
        if(n == null)
            n = 0;
        else
            n = parseInt(n);

        for(i = 1; i <= n; i++){
            var row = table.insertRow(i);
            cell = row.insertCell(0);
            cell.innerHTML = i;
            cell = row.insertCell(1);
            if(JSON.parse(localStorage.getItem(i)) != null){
                cell.innerHTML = JSON.parse(localStorage.getItem(i)).name;
            }
            else{
                cell.innerHTML = ""
            }
            cell = row.insertCell(2);
            if(JSON.parse(localStorage.getItem(i)) != null){
                cell.innerHTML = JSON.parse(localStorage.getItem(i)).quantity;
            }
            else{
                cell.innerHTML = ""
            }
        }
    }
}

class IndexedDB extends SaveData{
    constructor(name, quantity){
        super(name, quantity);
    }
    save(){
        var objectStore;
                numberOfProducts ++;
                var p = new ProductWthId(numberOfProducts, this.product.name, this.product.quantity);
                console.log(p);
                var OpenRequest = window.indexedDB.open("database2", 1);
        
                OpenRequest.onerror = event => {
                    console.log("Error!");
                }
                OpenRequest.onupgradeneeded = function(event){
                    var db = event.target.result;
                    if (!db.objectStoreNames.contains('products')){   
                        objectStore = db.createObjectStore("products", { keyPath: "id" });
                    }
                        
                    objectStore.createIndex('id', 'id', {unique:true})
                    objectStore.createIndex('name', 'name', {unique:false})
                    objectStore.createIndex('quantity', 'quantity', {unique:false})  
                    }

                    OpenRequest.onsuccess = function(event){
                        var db = OpenRequest.result;
                        var transaction = db.transaction("products", "readwrite")
                        var products = transaction.objectStore("products")
                            
                        var request = products.add(p)
                        console.log("aaaa");

                        request.onsuccess = function(){
                            console.log("aaaa");
                            var db = OpenRequest.result;
                            var transaction = db.transaction("products", "readwrite")
                            var products = transaction.objectStore("products")
                            
                            var count = products.count();
                            count.onsuccess = function(){
                            
                                console.log("bbbbb")
                                console.log(count.result);
                            
                                let i;
                                let table = document.getElementById("shopping");
                                let cell;
                            
                                //for(i = 1; i <= count.result; i++){
                                var row = table.insertRow(i);
                                cell = row.insertCell(0);
                                cell.innerHTML = numberOfProducts;
                            
                                cell = row.insertCell(1);
                            
                                let dbProduct = products.index("id").get(numberOfProducts)
                                dbProduct.onsuccess = function (){

                                if(dbProduct!= null){
                                    cell.innerHTML = dbProduct.result.name;
                                }
                                else{
                                    cell.innerHTML = ""
                                }

                                cell = row.insertCell(2);
                                if(dbProduct!= null){
                                    cell.innerHTML = dbProduct.result.quantity;
                                }
                                else{
                                    cell.innerHTML = ""
                                }

                            }
                                                    
                        }
                        request.onerror = function()
                        {
                            console.log("Produsul nu a fost adaugat.");
                        }
                }
            }
        }
    }
// }







                        // console.log("Added")
                        // let i;
                        // let table = document.getElementById("shopping");
                        // let cell;

                       
                    //     var row = table.insertRow(numberOfProducts);

                    //     cell = row.insertCell(0);
                    //     cell.innerHTML = numberOfProducts;
                    //     cell = row.insertCell(1);
                    //     var product_r = products.index("id").get(numberOfProducts)

                    //     product_r.onsuccess = function (){
                    //         if(product_r!= null){
                    //           cell.innerHTML = product_r.result.name;
                    //           console.log(product_r.result.name)
                    //         }
                    //         else{
                    //             cell.innerHTML = ""
                    //         }
                    //         cell = row.insertCell(2);
                    //         if(product_r!= null){
                    //           cell.innerHTML = product_r.result.quantity;
                    //         }
                    //         else{
                    //             cell.innerHTML = ""
                    //         }
                  
                    //       }
                          
                    //     }
                    //     request.onerror = function()
                    //     {
                    //       console.log("Produsul nu a fost adaugat.");
                    //     }
                    //   }
                    //     }




//     save(){
//         var objectStore;
//         numberOfProducts ++;
//         var p = new Product(this.product.name, this.product.quantity);
//         console.log(p);
//         var OpenRequest = window.indexedDB.open("database1", 1);

//         OpenRequest.onerror = event => {
//             console.log("Error!");
//         }

//         OpenRequest.onupgradeneeded = function(event){
//         var db = event.target.result;
//         if (!db.objectStoreNames.contains('products')){   
//             objectStore = db.createObjectStore("products", { keyPath: "name" });
//         }

//         objectStore.createIndex('name', 'name', {unique:false})
//         objectStore.createIndex('quantity', 'quantity', {unique:false})  
//         }
        
//         OpenRequest.onsuccess = function(event){
//             var db = OpenRequest.result;
//             var transaction = db.transaction("products", "readwrite")
//             var products = transaction.objectStore("products")

//             var request = products.add(p)
//             // console.log(request)
//             // var count = products.count();
            
//             request.onsuccess = function() {
//                 var db = OpenRequest.result;
//                 var transaction = db.transaction("products", "readwrite")
//                 var products = transaction.objectStore("products")

//                 var count = products.count();
//                 count.onsuccess = function(){

//                 console.log("bbbbb")
//                 console.log(count.result);

//                     let i;
//                     let table = document.getElementById("shopping");
//                     let cell;

//                     for(i = 1; i <= count.result; i++){
//                         var row = table.insertRow(i);
//                         cell = row.insertCell(0);
//                         cell.innerHTML = i;

//                         cell = row.insertCell(1);

//                         var db = OpenRequest.result;
//                         var transaction = db.transaction("products", "readwrite")
//                         var products = transaction.objectStore("products")
//                         console.log(products.get("name"))
//                         let dbProduct = products.index("name").get(i)
//                         dbProduct.onsuccess = function (){
//                             if(dbProduct!= null){
//                                 console.log(dbProduct.get(i));
//                                 cell.innerHTML = dbProduct.name;
//                             }
//                             else{
//                                 cell.innerHTML = ""
//                             }
//                         }      
//                 }
//             };
//         }
//     }
// }
// }



            // var db = event.target.result;


            // console.log("aaaa")
            // var transaction = db.transaction(["products"], "readonly");
            // var objectStore = transaction.objectStore("products"); 
            // console.log(objectStore.count() + "aaaaaa");
            // var count = objectStore.count();
            
            // count.onsuccess = function() {
            //     console.log("bbbbb")
            //     console.log(count.result);
            // };
            // console.log("TE ROG MERGI");
            // let table = document.getElementById("shopping");
            // let i;
            // let cell;
            // console.log(numberOfProducts)
            // for(i = 1; i <= objectStore.count(); i++){
            //     var row = table.insertRow(i);
            //     cell = row.insertCell(0);
            //     cell.innerHTML = i;
                // cell = row.insertCell(1);
                // if(JSON.parse(localStorage.getItem(i)) != null){
                //     cell.innerHTML = JSON.parse(localStorage.getItem(i)).name;
                // }
                // else{
                //     cell.innerHTML = ""
                // }
                // cell = row.insertCell(2);
                // if(JSON.parse(localStorage.getItem(i)) != null){
                //     cell.innerHTML = JSON.parse(localStorage.getItem(i)).quantity;
                // }
                // else{
                //     cell.innerHTML = ""
                // }
        //     }
        // }

        // const dbName = "storage";

        // let request = indexedDB.open(dbName, 2);
        // request.onerror = event => {
        //     console.log("error")
        // };

        // request.onupgradeneeded = event => {
        //     console.log("lala")
        //     let db = event.target.result;
        //     let objectStore = db.createObjectStore("storage", { keyPath: "name" });

        //     objectStore.createIndex("name", "name", { unique: false });
        //     objectStore.createIndex("quantity", "quantity", { unique: false });

        //     objectStore.transaction.oncomplete = event => {
        //         let products = db.transaction("storage", "readwrite").objectStore("storage");
        //         var productChanged = {
        //             name: this.product.name,
        //             quantity: this.product.quantity 
        //         }
        //         console.log(this.product.name)
        //         let request = products.add(productChanged);
        //         request.onsuccess = function (){
        //             console.log("product added to db")
        //         };
        //     };
        // };
    // }

function addProduct(){

    //WebWorker 
    var worker = new Worker('js/worker.js');    
    worker.postMessage("Add button pressed");
    console.log('Message posted to worker');
    worker.onmessage = function(e) {    
        console.log('Message received from worker');
    }
    // Inserarea in Local Storage
    if(document.getElementById("local").checked){
        // console.log("intri aici?")
        let localS = new LocalStorage(document.getElementById("numeProdus").value, document.getElementById("cantitateProdus").value);
        localS.save();
        localS.show();
    }
    if(document.getElementById("db").checked){
        // console.log("intri aici?")
        let localS = new IndexedDB(document.getElementById("numeProdus").value, document.getElementById("cantitateProdus").value);
        localS.save();
    }
}