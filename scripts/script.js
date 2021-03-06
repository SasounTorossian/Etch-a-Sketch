let containerID = document.getElementById("container")
let divContainer = document.querySelectorAll("#container div")
let bodyContainer = document.querySelector("body")

let activeMouse = false
const DEFAULT_COLOUR = "white"

// Event listener for handing mousedown. Toggles draw on
bodyContainer.addEventListener('mousedown', e => {
	clearSelection()
	let el = e.target

	// Only do something if left mouse button clicked
	if (e.button == 0) {
		// Only colour if clicked element is a colour block
		if(el.classList.value == "colourBlock") colourAndShadeRGB(el)
		activeMouse = true
	}
})

// Event listener for handing mouseip. Toggles draw off
bodyContainer.addEventListener('mouseup', e => {
	if (!e.button) activeMouse = false
})

// Event listener for reset button click. Selects grid size
let resetContainer = document.getElementById("resetInput")
resetContainer.addEventListener('click', () => {
	let gridSize = selectGridSize()
	if(gridSize) {
		generateGrid(gridSize)
		resetContainer.value = "Reset"
		activeMouse = false
	}
})

// Event listener for random button. Fills RGB grid randomly 
let radomContainer = document.getElementById("randomInput")
radomContainer.addEventListener('click', () => {
	divContainer = document.querySelectorAll("#container div")
	if (!divContainer.length) {
		alert("Please start the game and select a grid size.")
	}
	else {
		divContainer.forEach(div => {
			colourAndShadeRGB(div, true)
		})
	}
})

// Creates grid based on desired gridsize.
function generateGrid(gridSize) {
	containerID.innerHTML = '' //Clear grid
	containerID.style.width = 600 + "px"
	containerID.style.height = 600 + "px"
	let containerWidth = containerID.clientWidth
	let containerHeight = containerID.clientHeight

	// Check if required grid size will fit into original 600pxx600px container. If not, find excess and subtract from original container.
	if (containerWidth%gridSize != 0 ||
		containerHeight%gridSize != 0) {
			containerID.style.width = containerWidth - 
			containerWidth%gridSize + "px"
			containerID.style.height = containerHeight - 
			containerHeight%gridSize + "px"

			containerWidth = containerID.clientWidth
			containerHeight = containerID.clientHeight
	}

	let boxWidth = Math.floor(containerWidth/gridSize)
	let boxHeight= Math.floor(containerHeight/gridSize)

	// Create rows and columns based of chosen grid size
	for (let i = 0; i < gridSize; i++) {
		for (let j = 0; j < gridSize; j++) {
			let div = document.createElement("div")

			div.style.width = boxWidth + "px"
			div.style.height = boxHeight + "px"
			div.style.background = DEFAULT_COLOUR
			div.classList.add("colourBlock")

			// Add mouseover event handler to colour in blocks if button is pressed.
			div.addEventListener('mouseover', () => {
				if (activeMouse) colourAndShadeRGB(div)                    
			})
			containerID.appendChild(div)
		}
	let jump = document.createElement("br")
	document.getElementById("container").appendChild(jump)
	}
}

// Promt user to select a grid size.
function selectGridSize() {
	while (true) {
		selection = window.prompt("Select Grid Size (default is 10x10)", 10)
		if (checkIfNull(selection)) return 0

		selectionClean = numberCleanup(selection)
		if (checkIfValidNumber(selectionClean)) return selectionClean
	}
}

function checkIfNull(input) {
	return (input === null) ? true : false
}

function numberCleanup(number) {
	return Number(number.trim())
}

function checkIfValidNumber(number) {
	return isNaN(number) ? false : true
}

// Colours block if block is currently empty, or reset is passed as true. If block is already coloured, shade by 10%
function colourAndShadeRGB(elem, reset = false) {
	let rgb
	let r, g, b
	let r10, g10, b10
	if (elem.style.background == DEFAULT_COLOUR ||
		reset == true) {
		console.log("colour")
		rgb = randomRGB()
		r = rgb[0], g = rgb[1], b = rgb[2]
		r10 = r/10, g10 = g/10, b10 =b/10

		elem.setAttribute('r10', r10)
		elem.setAttribute('g10', g10)
		elem.setAttribute('b10', b10)
	}
	else { 
		console.log("shade")                                 
		r = elem.getAttribute('r') - 
			elem.getAttribute('r10')

		g = elem.getAttribute('g') - 
			elem.getAttribute('g10')

		b = elem.getAttribute('b') - 
			elem.getAttribute('b10')
	}
	
	elem.setAttribute('r', r)
	elem.setAttribute('g', g)
	elem.setAttribute('b', b)

	elem.style.backgroundColor = colourRGB(r, g, b)
}

// Generates random rgb value and returns array
function randomRGB() {
	let p = Math.round, q = Math.random, r = 255;
	return [p(q()*r), p(q()*r), p(q()*r)]
}

// Form rgb values into string and return
function colourRGB(r, g, b) {
	return 'rgb(' + r + ',' + g + ',' + b + ')'
}

// Prevents drag selection when pressing down on recently colour block
function clearSelection() {
	if (window.getSelection) {window.getSelection().removeAllRanges();}
	else if (document.selection) {document.selection.empty();}
}