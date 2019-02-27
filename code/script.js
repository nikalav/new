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
allLink.addEventListener("click", () => filter("all"));
modal.addEventListener("click", () => modal.classList.add("hide"));
closeBtn.addEventListener("click", () => modal.classList.add("hide"));

//define functions
function loadJSON(link){
	fetch(link).then(e=>e.json()).then(data=>data.feed.entry.forEach(displayLegoData));

}


function displayLegoData(brickArt){
	let section = main.querySelector('#'+brickArt.gsx$category.$t);
	if(!section){
		section = document.createElement('section');
		section.id=brickArt.gsx$category.$t;
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

	section.appendChild(clone);

}

//function for showing only the category clicked
function filter(cat){
   //console.log(cat);
   document.querySelectorAll("main section").forEach(section => {
                if (section.id == cat) {
                    section.classList.remove('hide');
                } else {
                    section.classList.add('hide');
                }
            })
}

//flip info
function showDetails(brickArt) {
	console.log(brickArt);

	modal.querySelector("img").setAttribute("src", "photos/"+img+".jpg");
	
	modal.querySelector("h2").textContent = brickArt.gsx$title.$t;
	modal.classList.remove("hide");
}


loadJSON(link);
