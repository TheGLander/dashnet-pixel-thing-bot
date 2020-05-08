const owop = require("better-owop-js")
const { arraysEqual } = require("./helpers")
const client = new owop.Client({
	reconnect: true,
	ws: "ws://dashnetpixels.duckdns.org/",
	controller: true,
	log: false,
})
function protect(position, size, onAttempt, postAttempt) {
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
		client.on("pixelUpdate", async pixel => {
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
					let revive = true
					if (onAttempt) revive = (await onAttempt(pixel)) ?? revive
					if (!revive)
						client.world.setPixel(
							pixel.x,
							pixel.y,
							pixelColors[pixel.x][pixel.y]
						)
					if (postAttempt) await postAttempt(pixel, revive)
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

async function saveImg(position, size) {
	const matrix = []
	for (let x = position[0]; x < position[0] + size[0]; x++) {
		matrix.push([])
		for (let y = position[1]; y < position[1] + size[1]; y++)
			matrix[x - position[0]].push(await client.world.getPixel(x, y))
	}
	return matrix
}

async function writeImg(position, matrix) {
	for (const x in matrix)
		for (const y in matrix[x])
			if (
				!arraysEqual(
					await client.world.getPixel(
						parseInt(x) + position[0],
						parseInt(y) + position[1]
					),
					matrix[x][y]
				)
			)
				await client.world.setPixel(
					parseInt(x) + position[0],
					parseInt(y) + position[1],
					matrix[x][y],
					true
				)
}
module.exports = { client, protect, fillRect, saveImg, writeImg }
