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
var nav = document.getElementById("navegar")

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

var arr = []
map.on('click', (e) => {
	var pos = [ e.latlng.lat, e.latlng.lng ]
	arr.push( pos )
	console.log( arr )
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
		// e.drawPopup(map)
		nav.innerHTML += `<ul onclick="moveit(${idx})">${e.nome}</ul>`
	} )
} )

function moveit(id) {
	areas[id].goto(map)
}