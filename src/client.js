const owop = require("better-owop-js")

const client = new owop.Client({
	reconnect: true,
	ws: "ws://dashnetpixels.duckdns.org/",
	controller: true,
	log: false,
})
async function protect(position, size, onAttempt) {
	const promises = []
	const pixelColors = {}
	for (let x = position[0]; x <= position[0] + size[0]; x++) {
		pixelColors[x] = {}
		for (let y = position[1]; y <= position[1] + size[1]; y++)
			promises.push(
				client.world.getPixel(x, y).then(val => (pixelColors[x][y] = val))
			)
	}
	Promise.all(promises).then(() => {
		let forceOff = false
		client.on("pixelUpdate", pixel => {
			if (
				pixel.x >= position[0] &&
				pixel.x <= position[0] + size[0] &&
				pixel.y >= position[1] &&
				pixel.y <= position[1] + size[1] &&
				//A technical limitation
				pixel.id !== client.player.id
			) {
				let prevent = false
				if (onAttempt) prevent = onAttempt(pixel)
				if (!prevent)
					client.world.setPixel(pixel.x, pixel.y, pixelColors[pixel.x][pixel.y])
			}
		})
	})
}
module.exports = { client, protect }
