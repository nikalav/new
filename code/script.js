//select DOM elements
const template = document.querySelector("#setTemplate").content;
const main = document.querySelector("main");

//make shortcuts to API endpoints
const link = "https://spreadsheets.google.com/feeds/list/1RVK5ksJDyymK5QzZwrJ2KYxq5KKuAsBbbH0gmk9czps/1/public/values?alt=json";

var database = null;

//define functions
function loadJSON(link){
	fetch(link).then(e=>e.json()).then(data=>database = data.feed.entry);
}

// add a lego set to displayed sets
function displayLegoData(legoSet) {
	let newSet = template.cloneNode(true);
	newSet.querySelector('.setTitleFront').textContent = legoSet.gsx$title.$t;
	newSet.querySelector('.setTitleBack').textContent = legoSet.gsx$title.$t;
	newSet.querySelector('.setPicture').src = "photos/" + legoSet.gsx$imagename.$t + ".jpg";
	newSet.querySelector("p").textContent = legoSet.gsx$description.$t;
	newSet.querySelectorAll(".control").forEach(control => control.classList.add("bgColorLinear" + legoSet.gsx$category.$t));
	main.appendChild(newSet);
}

//function for showing only the clicked category
function changeCategory(cat) { 
	document.querySelectorAll(".topMenuPosition").forEach(menuPosition => {
		if (menuPosition.dataset.category == cat) menuPosition.classList.add("topMenuSelected") 
		else menuPosition.classList.remove("topMenuSelected")
	});
	document.querySelectorAll(".mainMenuSection").forEach(menuSection => {
		if (menuSection.dataset.category == cat) menuSection.classList.remove("hide") 
		else menuSection.classList.add("hide")
	});
	while (main.firstChild) main.firstChild.remove();
    database.forEach(legoSet => { if (legoSet.gsx$category.$t == cat) displayLegoData(legoSet) });
}

function flip(article) {
	let currentFront = article.querySelector(".over");
	let currentBack = article.querySelector(".under");
	currentFront.addEventListener("animationend", function onHalfTurn(event) {
		currentFront.removeEventListener("animationend", onHalfTurn);
		currentFront.classList.remove("over");
		currentFront.classList.add("under");
		currentFront.classList.remove("turnDissapearC");
		currentBack.addEventListener("animationend", function onFullTurn(event) { 
			currentBack.removeEventListener("animationend", onFullTurn);
			currentBack.classList.remove("turnAppearC");
		});
		currentBack.classList.add("over");
		currentBack.classList.add("turnAppearC");
		currentBack.classList.remove("under");
	});
	currentFront.classList.add("turnDissapearC");
}

function home() {
	document.querySelectorAll(".mainMenuSection").forEach(menuSection => menuSection.classList.remove("hide"));
	document.querySelectorAll(".topMenuPosition").forEach(menuPosition => {
		if (menuPosition.dataset.category == 'Home') menuPosition.classList.add("topMenuSelected") 
		else menuPosition.classList.remove("topMenuSelected")
	});
	while (main.firstChild) main.firstChild.remove();
}

loadJSON(link);
