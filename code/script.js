//select DOM elements
const template = document.querySelector("#set").content;
const main = document.querySelector("main");
const nav = document.querySelector("nav");
const allLink = document.querySelector("#all");
const modal = document.querySelector(".model-bg");
const closeBtn = document.querySelector(".close-btn");

//make shortcuts to API endpoints
const link = "https://spreadsheets.google.com/feeds/list/1RVK5ksJDyymK5QzZwrJ2KYxq5KKuAsBbbH0gmk9czps/1/public/values?alt=json";

//add global eventListeners
allLink.addEventListener("click", () => showCategory("all"));
modal.addEventListener("click", () => modal.classList.add("hide"));
closeBtn.addEventListener("click", () => modal.classList.add("hide"));

//define functions
function loadJSON(link){
	fetch(link).then(e=>e.json()).then(data=>data.feed.entry.forEach(displayLegoData));

}

function displayLegoData(brickArt){
	//const section = document.querySelector('#' + brickArt.gsx$category.$t);
	let section = main.querySelector('#cat_'+brickArt.gsx$category.$t);
	if(!section){
		const newHeader = document.createElement("h1");
		newHeader.textContent =brickArt.gsx$category.$t;
		main.appendChild(newHeader);
		section = document.createElement('section');
		section.id='cat_'+brickArt.gsx$category.$t;
		main.appendChild(section);
		 const a = document.createElement("a");
        a.textContent = brickArt.gsx$category.$t;
        a.href = "#";
        a.addEventListener("click", ()=>filter(brickArt.gsx$category.$t));
        nav.appendChild(a);
		
	}
	let clone = template.cloneNode(true);
	clone.querySelector("h2").textContent = brickArt.gsx$title.$t;

	const img = brickArt.gsx$imagename.$t;
	clone.querySelector("img").setAttribute("src", "photos/"+img+".jpg");
//	clone.querySelector("p").textContent = brickArt.gsx$description.$t;

	section.appendChild(clone);

}
//flip info
function showDetails(brickArt) {
	console.log(brickArt);

	modal.querySelector("img").setAttribute("src", "photos/"+img+".jpg");
	
	modal.querySelector("h2").textContent = brickArt.gsx$title.$t;
	modal.classList.remove("hide");
}

loadJSON(link);
