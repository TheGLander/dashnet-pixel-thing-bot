const owop = require("better-owop-js")

const client = new owop.Client({
	reconnect: true,
	ws: "ws://dashnetpixels.duckdns.org/",
	controller: true,
	log: false,
})
function protect(position, size, onAttempt) {
	const promises = []
	const pixelColors = {}
	for (let x = position[0]; x < position[0] + size[0]; x++) {
		pixelColors[x] = {}
		for (let y = position[1]; y < position[1] + size[1]; y++)
			promises.push(
				client.world.getPixel(x, y).then(val => (pixelColors[x][y] = val))
			)
	}
	Promise.all(promises).then(() => {
		client.on("pixelUpdate", pixel => {
			if (
				pixel.x >= position[0] &&
				pixel.x < position[0] + size[0] &&
				pixel.y >= position[1] &&
				pixel.y < position[1] + size[1]
				//A technical limitation
			) {
				if (pixel.id === client.player.id) {
					pixelColors[pixel.x][pixel.y] = pixel.color
				} else {
					let prevent = false
					if (onAttempt) prevent = onAttempt(pixel)
					if (!prevent)
						client.world.setPixel(
							pixel.x,
							pixel.y,
							pixelColors[pixel.x][pixel.y]
						)
				}
			}
		})
	})
}
async function fillRect(position, size, color) {
	for (let x = position[0]; x < position[0] + size[0]; x++) {
		for (let y = position[1]; y < position[1] + size[1]; y++)
			await client.world.setPixel(x, y, color)
	}
}
module.exports = { client, protect, fillRect }
