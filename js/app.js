/*
    FILE: app.js
    DATE: 2022-07-05
    DATE MODIFIED: 2022-07-06
    DATE MODIFIED: 2022-07-06
    AUTHOR: Jordan Lindo
    DESCRIPTION: The logic for voting
*/


"use strict";

/**********************************************************************************
    GLOBALS
**********************************************************************************/
var collection;
var imageCount = 3;
var images = [];
var currentIndices = [];
var section;
var currentClicks;
var maxClicks = 25;
var labelSet = [];
var itemClicks = [];
var itemViews = [];

/**********************************************************************************
    OBJECTS
**********************************************************************************/


/**
 * Product Full Constructor
 * 
 * @param {string} name - item name
 * @param {string} src -image source
 * @param {number} timesShown - a count of the times the image is shown
 * @param {number} clicks - a count of the number of times the image was clicked
 */
function Product(name,src,timesShown,clicks){
    this.name = name;
    this.src = src;
    if(timesShown == undefined){
        timesShown = 0;
    }
    this.timesShown = timesShown;
    if(clicks == undefined){
        clicks = 0;
    }
    this.clicks = clicks;
}

/**
 * A collection of products.
 */
function ProductCollection(){
    this.totalClicks = 0;
    this.productList = this.initialize();
}


ProductCollection.prototype.initialize = function(){
    let key = "collection";
    let set = localStorage.getItem(key);
    let result = [];
    if(set != null){
        let parsed = JSON.parse(set);
        parsed.productList.forEach(productString => {
            result.push(new Product(productString.name,
                productString.src,productString.timesShown,productString.clicks));
        });
        this.totalClicks = parsed.totalClicks;
    }
    return result;
}


ProductCollection.prototype.updateLocalStorage = function(){
    let key = "collection";
    localStorage.setItem(key,JSON.stringify(collection));
}


/**********************************************************************************
    VIEW LOGIC
**********************************************************************************/


/**
 * Renders the images
 */
 function render(){
    currentIndices = getRandomUniqueIndexSet(imageCount);
    section.innerHTML = "";
    let sectionHead = document.createElement('h2');
    sectionHead.innerText = "Choose your favorite!";
    section.appendChild(sectionHead);
    for (let i = 0; i < imageCount; i++) {
        let image = document.createElement("img");
        let element = collection.productList[currentIndices[i]];
        image.alt = element.name;
        image.src = element.src;
        element.timesShown++;
        images[i] = image;
        section.appendChild(image);
    }
    collection.updateLocalStorage();
}


/**
 * Renders a list of results
 */
function renderViewResults(){
    //console.log("results");
    let ul = document.querySelector("ul");
    ul.innerHTML = "";
    for (let i = 0; i < collection.productList.length; i++) {
        const element = collection.productList[i];
        let li = document.createElement("li");
        li.textContent = `${element.name} had ${element.timesShown} views and was clicked ${element.clicks} times.`
        ul.appendChild(li);
    }
    ul.style.visibility = "visible";
}

function renderCharts(){
    labelSet = [];
    itemClicks = [];
    itemViews = [];
    fillDataSets();
    renderBarChart();
    renderScatter();

}


/**
 * Render a bar chart
 */
function renderBarChart(){
    let canvas = document.getElementById("myChart").getContext('2d');
    let myChart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labelSet,
            datasets: [
                {
                    label: "Likes",
                    data: itemClicks,
                    backgroundColor: ["rgba(124, 62, 102, 0.2)"],
                    borderColor: ["rgb(124, 62, 102)"],
                    borderWidth: 1
                },
                {
                    label: "Views",
                    data: itemViews,
                    backgroundColor: ["rgba(36, 58, 115, 0.2)"],
                    borderColor: ["rgb(36, 58, 115)"],
                    borderWidth: 1
                }
            ]

        },
        y: {
            beginAtZero: true,
        }
    });

    let finishedCanvas = document.getElementById("myChart");
    finishedCanvas.style.background = "#F2EBE9";

}


function renderScatter(){
    let set = [];
    for (let i = 0; i < collection.productList.length; i++) {
         let coord = {x: itemClicks[i] ,y: 
         itemViews[i] };
         set.push(coord);
        
    }

    let canvas = document.getElementById("scatterChart").getContext('2d');
    let data = {
        datasets: [{
            label:"Product Scatter",
            data: set,
            backgroundColor: ["rgb(124, 62, 102)"]
        }]
    };
    let config = {
        type: 'scatter',
        data: data,
            scales: {
                xAxes: [{
                   ticks: {
                      beginAtZero: true
                   },
                }],
                yAxes: [{
                   ticks: {
                      beginAtZero: true
                   }
                }]
             
        }
    };
    let myChart = new Chart(canvas, config);

    let finishedCanvas = document.getElementById("scatterChart");
    finishedCanvas.style.background = "#F2EBE9";
}


/**********************************************************************************
    LOGIC
**********************************************************************************/

/**
 * gets a random set of unique indices with a length of number with collection.productList as the source for range
 * 
 * @param {number} number - the number of items to select
 * -@returns an array of unique numbers with length of number
 */
function getRandomUniqueIndexSet(number){
    let result = [];
    let i = 0;
    while(i < number){
        let pos = Math.floor(Math.random() * collection.productList.length);
           if(!result.includes(pos) && !currentIndices.includes(pos)){
                result.push(pos);
                i++;
           }
    }

    return result;
}

/**
 * Fill the data sets for charts.
 */
function fillDataSets() {
    collection.productList.forEach(product => {
        labelSet.push(product.name);
        itemClicks.push(product.clicks);
        itemViews.push(product.timesShown);
    });
}

/**
 * A function for handling a click on a product.
 * 
 * @param {event} evt passed in from listener
 */
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
                        collection.updateLocalStorage();
                        //console.log(collection.productList[currentIndices[index]].clicks);
                        break;
                    }
                
                }
                currentClicks++;
                collection.totalClicks++;
                collection.updateLocalStorage();
                if(currentClicks < maxClicks){
                    render();
                }else if(currentClicks >= maxClicks){
                    //console.log("25");
                    section.removeEventListener("click", handleProductClick);
                    let main = document.querySelector("main");
                    let button = document.createElement("button");
                    button.textContent = "View Results";
                    button.id = "btnResults";
                    button.addEventListener("click", renderViewResults);
                    main.appendChild(button);
                    renderCharts();
                    collection.totalClicks = 0;
                    collection.updateLocalStorage();
                }
            }
    }
}

/**
 * Generates a set of empty img elements with a quantity of imageCount and adds the empty img to the array images
 */
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

    if(collection.productList.length === 0){

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

        collection.updateLocalStorage();

        
    }
    currentClicks = collection.totalClicks;
    // Check if imageCount needs adjusted
    let maxCount = Math.floor(collection.productList.length / 2);
    if(imageCount > maxCount){
        imageCount = maxCount;
        console.log("Marketing requests a unique set each iteration.");
    }

    section = document.querySelector("section");
    getImageTags();
    section.addEventListener("click", handleProductClick);

    render();
    
    
}

initialize();
