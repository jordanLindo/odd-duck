/*
    FILE: app.js
    DATE: 2022-07-05
    AUTHOR: Jordan Lindo
    DESCRIPTION: The logic for voting
*/

"use strict";

/**
 * Globals
 */
var collection;
var imageCount = 4;
var images = [];
var currentIndices = [];
var section;
var currentClicks = 0;
var maxClicks = 25;


/*
    OBJECTS
*/

/**
 * A constructor for product
 * 
 * @param {string} name - product name
 * @param {string} src - image source
 */
function Product(name,src){
    this.name = name;
    this.src = src;
    this.timesShown = 0;
    this.clicks = 0;
}


/**
 * A collection of products.
 */
function ProductCollection(){
    this.productList = [];
}


/*
   VIEW LOGIC
*/


/**
 * Renders the images
 */
 function render(){
    currentIndices = getRandomUniqueIndexSet(imageCount);
    section.innerHTML = "";

    for (let i = 0; i < imageCount; i++) {
        let image = document.createElement("img");
        let element = collection.productList[currentIndices[i]];
        image.alt = element.name;
        image.src = element.src;
        element.timesShown++;
        images[i] = image;
        section.appendChild(image);
    }



}



function renderViewResults(){
    console.log("results");
    let ul = document.querySelector("ul");
    ul.innerHTML = "";
    for (let i = 0; i < collection.productList.length; i++) {
        const element = collection.productList[i];
        let li = document.createElement("li");
        li.textContent = `${element.name} had ${element.timesShown} views and was clicked ${element.clicks} times.`
        ul.appendChild(li);
    }
}

/*
    LOGIC
*/

/**
 * 
 * @param {number} number - the number of items to select
 * -@returns an array of unique numbers with length of number
 */
function getRandomUniqueIndexSet(number){
    let result = [];
    let i = 0;
    while(i < number){
        let pos = Math.floor(Math.random() * collection.productList.length);
           if(result.length === 0 || !result.includes(pos)){
                result.push(pos);
                i++;
           }
    }

    return result;
}

function handleProductClick(evt){
    let found = false;
    for (let i = 0; i < images.length; i++) {
        const element = images[i].alt;
        if(evt.target.alt == element){
            found = true;
        }
    }

    if(found){
            if(currentClicks < maxClicks ){
                let setToCheck = [];
                for (let i = 0; i < currentIndices.length; i++) {
                    const pos = currentIndices[i];
                    setToCheck.push(collection.productList[pos]);
                }
                let selected = evt.target.alt;
                for (let index = 0; index < setToCheck.length; index++) {
                    const element = setToCheck[index].name;
                    if(selected === element){
                        collection.productList[currentIndices[index]].clicks++;
                        console.log(collection.productList[currentIndices[index]].clicks);
                        break;
                    }
                
                }
                currentClicks++;
                if(currentClicks < maxClicks){
                    render();
                }else if(currentClicks >= maxClicks){
                    console.log("25");
                    section.removeEventListener("click", handleProductClick);
                    let div = document.querySelector("div");
                    let button = document.createElement("button");
                    button.textContent = "View Results";
                    button.addEventListener("click", renderViewResults);
                    div.appendChild(button);
                }
            }
    }
}


function getImageTags(){
    for (let index = 0; index < imageCount; index++) {
        let image = document.createElement("img");
        images.push(image);

    }
}


/**
 * Entry point
 */
function initialize(){
    console.log("In initialize()");
    collection = new ProductCollection();

    collection.productList.push(new Product("bag","./img/bag.jpg"));
    collection.productList.push(new Product("banana","./img/banana.jpg"));
    collection.productList.push(new Product("bathroom","./img/bathroom.jpg"));
    collection.productList.push(new Product("boots","./img/boots.jpg"));
    collection.productList.push(new Product("breakfast","./img/breakfast.jpg"));
    collection.productList.push(new Product("bubblegum","./img/bubblegum.jpg"));
    collection.productList.push(new Product("chair","./img/chair.jpg"));
    collection.productList.push(new Product("cthulhu","./img/cthulhu.jpg"));
    collection.productList.push(new Product("dog-duck","./img/dog-duck.jpg"));
    collection.productList.push(new Product("dragon","./img/dragon.jpg"));
    collection.productList.push(new Product("pen","./img/pen.jpg"));
    collection.productList.push(new Product("pet-sweep","./img/pet-sweep.jpg"));
    collection.productList.push(new Product("scissors","./img/scissors.jpg"));
    collection.productList.push(new Product("shark","./img/shark.jpg"));
    collection.productList.push(new Product("sweep","./img/sweep.png"));
    collection.productList.push(new Product("tauntaun","./img/tauntaun.jpg"));
    collection.productList.push(new Product("unicorn","./img/unicorn.jpg"));
    collection.productList.push(new Product("water-can","./img/water-can.jpg"));
    collection.productList.push(new Product("wine-glass","./img/wine-glass.jpg"));

    section = document.querySelector("section");
    getImageTags();
    section.addEventListener("click", handleProductClick);

    render();
    
    
}

initialize();
