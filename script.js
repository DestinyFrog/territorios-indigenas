class Area {

	constructor(e) {
		this.nome = e.nome
		this.land = e.land
		this.mark = e.mark
	}

	goto(map) {
		map.flyTo(
			this.mark.coordinates,
			this.mark.zoom
		)
	}

	drawArea(map) {
		if ( Array.isArray( this.land.coordinates ) ) {
			L.polygon( this.land.coordinates )
			.setStyle( this.land.style )
			.addTo(map)
		} else {
			
		}
	}

	drawPopup(map) {
		L.popup(this.mark.coordinates, {content: this.nome})
		.openOn(map)
	}

}

var areas = null

var map = L.map('map').setView([0,0], 5)
const selector = document.getElementById("nav-ling")

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

var arr = []
map.on('click', (e) => {
	var pos = [ e.latlng.lat, e.latlng.lng ]
	arr.push( pos )

	text = ""
	arr.forEach( ([la,ln]) =>
		text += `[${la},${ln}],\n` )
	console.log( text )
})

map.flyTo(
	[ -15.7, -47.8 ],
	3
)

fetch("./script.json")
.then( response => response.json() )
.then( data => {
	areas = data.map( e => new Area(e) )

	areas.forEach( (e,idx) => {
		e.drawArea(map)
		selector.innerHTML += `<option value="${idx}">${e.nome}</option>`
	} )
} )

document.getElementById("selector").addEventListener('change', (ev) =>
	moveit( ev.target.value ) )

function moveit(id) {
	areas[id].goto(map)
}