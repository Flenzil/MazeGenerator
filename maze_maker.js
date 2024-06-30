const MIN_MAZE_SIZE = 1;
const MAX_MAZE_SIZE = 100;
const DEFAULT_MAZE_SIZE = 10;

/**
 * Main function. Builds solvable maze and updates table in html to reflect
 * the path.
*/
function buildMaze() {

    // Initialise stacks
    const visitedCells = [];
    const closedCells = [];

    // Set size to user defined value
    let mazeSize = clamp(document.getElementById("maze-size").valueAsNumber, MIN_MAZE_SIZE, MAX_MAZE_SIZE);

    // If user has inputted non-number, set to default value instead.
    if (isNaN(mazeSize)) {
        mazeSize = DEFAULT_MAZE_SIZE;
    }

    // Maze is constructed using a table and selectively hiding edges to
    // visualise the path.
    createSquareTable(mazeSize);

    // Randomly choose starting point
    visitedCells.push(randomGridPosition(mazeSize));

    while (visitedCells.length > 0) {
        let cell = visitedCells[visitedCells.length - 1];
        let neighbors = findNeighbors(cell.x, cell.y, visitedCells, closedCells, mazeSize);

        // All neighbors explored, never visit this cell again.
        // Step backwards to previous cell.
        if (Object.keys(neighbors).length === 0) {
            closedCells.push(visitedCells.pop());
            continue;
        }

        let direction = randomDirection(neighbors);
        let nextCell = neighbors[direction];

        visitedCells.push(nextCell);

        removeCellEdge(cell.x, cell.y, direction)

        //Each cell is double-walled e.g a cell shares its left edge with its
        //neighbors right edge. Both must be removed to create a path.
        removeCellEdge(nextCell.x, nextCell.y, getOppositeDirection(direction))
    }

    // Create entrance and exit
    removeCellEdge(0, Math.floor(Math.random() * mazeSize), "left")
    removeCellEdge(mazeSize - 1, Math.floor(Math.random() * mazeSize), "right")
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(value, min));
}

/**
 * Create table in document with all edges intact to be removed as maze
 * progresses.
 *
 * @param {number} size - number of rows/cols in table.
*/
function createSquareTable(size) {
    document.getElementById("maze").innerHTML = "";

    table = document.getElementById("maze");

    for (let i = 0; i < size; i++) {
        const tr = table.insertRow();
        for (let j = 0; j < size; j++) {
            tr.insertCell().classList.add("top", "bottom", "left", "right");
        }
    }
}

/**
 * @param {number} gridSize - Size of square grid
 *
 * @typedef {Object} cell
 * @property {number} x position of cell
 * @property {number} y position of cell
 *
 * @returns {cell}
*/
function randomGridPosition(gridSize) {
    return {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    };
}

/**
    * Find top, bottom, left and right neighbors of cell in grid.
    * Selects only valid cells i.e inside grid, not in visitedCells or
    * closedCells.
    *
    * @param {number} x - x position of cell
    * @param {number} y - y position of cell
    * @param {Array{Object}} visitedCells - stack of previously visited cells
    * @param {Array{Object}} closedCells - stack of cells out of consideration.
    * @param {number} gridSize - size of square grid.
    *
    * @typedef {Object} neighbors
    * @property {Object} neighbors.direction - cell object for neighbor in direction
    *
    * @returns {neighbors} - neighboring cells
*/
function findNeighbors(x, y, visitedCells, closedCells, gridSize) {
    let neighbors = {
        right: { x: x + 1, y: y },
        left: { x: x - 1, y: y },
        bottom: { x: x, y: y + 1 },
        top: { x: x, y: y - 1 }
    }

    for (let n in neighbors) {
        if (!isInsideGrid(neighbors[n].x, neighbors[n].y, gridSize)
            || arrayContainsOject(closedCells, neighbors[n])
            || arrayContainsOject(visitedCells, neighbors[n])) {
            delete neighbors[n];
            continue;
        }
    }
    return neighbors;
}

/**
 * @param {number} x - x position of cell.
 * @param {number} y - y position of cell.
 * @param {number} gridSize - size of square grid.
 *
 * @returns {boolean} True if cell is inside grid, else false.
*/
function isInsideGrid(x, y, gridSize) {
    return x < gridSize && x >= 0 && y < gridSize && y >= 0;
}

/**
 * Helper function for matching a cell in an array
 *
 * @param {Array} array - array of cells
 * @param {Object} object - a cell.
 *
 * @returns {boolean} True if array contains cell, else false.
*/
function arrayContainsOject(array, object) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].x === object.x && array[i].y === object.y) {
            return true;
        }
    }
    return false;
}

/**
 * @typedef {Object} neighbors
 * @property {Object} neighbors.direction - cell object for neighbor in direction
 *
 * @param {neighbors} neighbors - object containing potential next steps in algorithm.
 *
 * @returns {string} the direction that the algorithm will explore next. 
*/
function randomDirection(neighbors) {
    keys = Object.keys(neighbors);
    return keys[Math.floor(keys.length * Math.random())];
}


/**
 * @param {number} x - x position of cell
 * @param {number} y - y position of cell
 * @param {"top" | "bottom" | "left" | "right"} edge - edge to remove
 */
function removeCellEdge(x, y, edge) {
    document.getElementById("maze")
        .rows.item(y)
        .cells.item(x)
        .classList.remove(edge);
}

/**
 * @param {"top" | "bottom" | "left" | "right"} direction
 *
 * @returns {"bottom" | "top" | "right" | "left"} opposite direction.
*/
function getOppositeDirection(direction) {
    switch (direction) {
        case "top":
            return "bottom";
        case "bottom":
            return "top";
        case "left":
            return "right";
        case "right":
            return "left";
    }
}

