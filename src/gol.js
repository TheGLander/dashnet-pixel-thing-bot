//Game of life
//Config
const { client, protect } = require("./client")
const startCoords = [416, 144]
const width = 48
const height = 48

let paused = false
class GameOfLife {
	state = []
	getNeighbors(position) {
		const neighbors = []
		for (let x = -1; x <= 1; x++)
			for (let y = -1; y <= 1; y++)
				if (this.state[position[0] + x]?.[position[1] + y] !== undefined)
					neighbors.push(this.state[position[0] + x][position[1] + y])
		return neighbors
	}
	constructor(width, height) {
		this.width = width
		this.height = height
		for (let x = 0; x < width; x++) {
			this.state.push([])
			for (let y = 0; y < height; y++) this.state[x].push(false)
		}
	}
	step() {
		const newMatrix = []
		for (let x = 0; x < width; x++) {
			newMatrix.push([])
			for (let y = 0; y < height; y++) {
				let newState = this.state[x][y]
				const neighbors =
					this.getNeighbors([x, y]).filter(val => val).length - newState
				//Rules
				if (neighbors !== 2) newState = false
				if (neighbors === 3) newState = true
				newMatrix[x].push(newState)
			}
		}
		this.state = newMatrix
	}
}

async function getPixels() {
	const matrix = []
	for (let x = startCoords[0]; x < startCoords[0] + width; x++) {
		matrix.push([])
		for (let y = startCoords[1]; y < startCoords[1] + height; y++) {
			const pixel = await client.world.getPixel(x, y)
			//Determine if the pixel is more black or white
			matrix[x - startCoords[0]].push(
				pixel.reduce((acc, val) => acc + val) > 382
			)
		}
	}
	return matrix
}

function setPixels(oldMatrix, matrix) {
	for (const x in matrix)
		for (const y in matrix[x])
			if (oldMatrix[x][y] !== matrix[x][y])
				client.world.setPixel(
					parseInt(x) + startCoords[0],
					parseInt(y) + startCoords[1],
					matrix[x][y] ? [255, 255, 255] : [0, 0, 0],
					true
				)
}

const gameOfLife = new GameOfLife(width, height)
protect([450, 192], [7, 7], () => {
	paused = true
})
protect([457, 192], [7, 7], () => {
	paused = false
})
setInterval(async function () {
	if (paused) return
	const oldState = await getPixels()
	gameOfLife.state = oldState
	gameOfLife.step()
	setPixels(oldState, gameOfLife.state)
}, 1000)
