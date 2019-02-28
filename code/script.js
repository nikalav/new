//select DOM elements
const template = document.querySelector("#setTemplate").content;
const main = document.querySelector("main");
const burgerToggle = document.querySelector(".burgerToggle");
const about = document.querySelector(".about");
const aboutInfo = document.querySelector(".aboutInfo");

//make shortcuts to API endpoints
const link = "https://spreadsheets.google.com/feeds/list/1RVK5ksJDyymK5QzZwrJ2KYxq5KKuAsBbbH0gmk9czps/1/public/values?alt=json";

var database;

//define functions
function loadJSON(link){
	fetch(link).then(e=>e.json()).then(data=>database = data.feed.entry); // load JSON and save it in the 'database' variable
}

// add a lego set to displayed sets
function displayLegoData(legoSet) {
	let newSet = template.cloneNode(true); // clone the template and set all the fields
	newSet.querySelector('.setTitleFront').textContent = legoSet.gsx$title.$t;
	newSet.querySelector('.setTitleBack').textContent = legoSet.gsx$title.$t;
	newSet.querySelector('.setPicture').src = "photos/" + legoSet.gsx$imagename.$t + ".jpg";
	newSet.querySelector("p").textContent = legoSet.gsx$description.$t;
	newSet.querySelectorAll(".control").forEach(control => control.classList.add("bgColorLinear" + legoSet.gsx$category.$t)); // set appropriate flipping buttons color
	main.appendChild(newSet);
}

//function for showing only the clicked category
function changeCategory(cat) { 
	document.querySelectorAll(".topMenuPosition").forEach(menuPosition => { // find the top menu position of the selected class and mark it as 'selected'
		if (menuPosition.dataset.category == cat) menuPosition.classList.add("topMenuSelected") 
		else menuPosition.classList.remove("topMenuSelected")
	});
	document.querySelectorAll(".mainMenuSection").forEach(menuSection => { // hide all the tiles in the tile menu but the one we selected
		if (menuSection.dataset.category == cat) menuSection.classList.remove("hide") 
		else menuSection.classList.add("hide")
	});
	while (main.firstChild) main.firstChild.remove(); // remove all content from any category that was selected previously
	database.forEach(legoSet => { if (legoSet.gsx$category.$t == cat) displayLegoData(legoSet) }); // display entries from the database that match the selected category 
	about.classList.remove("showAboutTile"); // if about was displayed, hide it
	aboutInfo.classList.add("hide");
	burgerToggle.classList.remove('burgerToggleShow');
}

function flip(article) {
	let currentFront = article.querySelector(".over"); // the section that is currently on top
	let currentBack = article.querySelector(".under"); // the section that is currently hidden
	currentFront.addEventListener("animationend", function onHalfTurn(event) { // this event listener will activate after 'currentFront' is rotated 90 degrees
		currentFront.removeEventListener("animationend", onHalfTurn); // remove the function from the currentFront
		currentFront.classList.remove("over"); // it is no longer 'over' 
		currentFront.classList.add("under"); // now it is hidden
		currentFront.classList.remove("turnDissapearC"); // remove animation class
		currentBack.addEventListener("animationend", function onFullTurn(event) {  // add event listener which will activate upon complete flip, to do cleanup
			currentBack.removeEventListener("animationend", onFullTurn);  // remove event handler
			currentBack.classList.remove("turnAppearC"); // remove animation class
		});
		currentBack.classList.add("over"); // 'currentBack' is the new top section 
		currentBack.classList.add("turnAppearC"); // add animation to turn it from 90 degrees to 0
		currentBack.classList.remove("under"); // remove 'under' - now it is visible
	});
	currentFront.classList.add("turnDissapearC"); // start the flip animation 
}

function home() {
	about.classList.remove("showAboutTile"); // if about was displayed, hide it
	aboutInfo.classList.add("hide");
	document.querySelectorAll(".mainMenuSection").forEach(menuSection => menuSection.classList.remove("hide")); // show all the tiles in the tile menu
	document.querySelectorAll(".topMenuPosition").forEach(menuPosition => { // mark 'home' as selected and all others as not selected
		if (menuPosition.dataset.category == 'Home') menuPosition.classList.add("topMenuSelected") 
		else menuPosition.classList.remove("topMenuSelected")
	});
	while (main.firstChild) main.firstChild.remove(); // remove all the content entries, as they are not on the home page
}

function showAbout() {
	changeCategory("About");
	aboutInfo.classList.remove("hide");
	about.classList.add("showAboutTile");
}

function toggleMenu() {
	burgerToggle.classList.toggle('burgerToggleShow');
}

loadJSON(link);