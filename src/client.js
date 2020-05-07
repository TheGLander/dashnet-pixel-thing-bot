const owop = require("better-owop-js")

const client = new owop.Client({
	reconnect: true,
	ws: "ws://dashnetpixels.duckdns.org/",
	controller: true,
	log: false,
})
function protect(position, onAttempt) {
	client.world.getPixel(position[0], position[1]).then(ogColor => {
		client.on("pixelUpdate", pixel => {
			if (pixel.x === position[0] && pixel.y === position[1]) {
				let prevent = false
				if (onAttempt) prevent = onAttempt(pixel)
				if (!prevent) client.world.setPixel(position[0], position[1], ogColor)
			}
		})
	})
}
module.exports = { client, protect }
