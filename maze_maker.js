let size = 0; // square size of maze

/**
 * Main function. Builds solvable maze and updates table in html to reflect
 * the path.
*/
function buildMaze() {

    // Initialise and reset 
    const visitedCells = [];
    const closedCells = [];
    size = Math.max(1, Math.min(document.getElementById("maze-size").value, 100));
    document.getElementById("maze").innerHTML = "";

    createTable();

    visitedCells.push(randomGridPosition());

    while (visitedCells.length > 0) {
        let cell = visitedCells[visitedCells.length - 1];
        let neighbors = findNeighbors(cell.x, cell.y, visitedCells, closedCells);

        if (Object.keys(neighbors).length === 0) {
            closedCells.push(visitedCells.pop());
            continue;
        }

        let direction = randomDirection(neighbors);
        let nextCell = neighbors[direction];

        visitedCells.push(nextCell);

        removeCellEdge(cell.x, cell.y, direction)
        removeCellEdge(nextCell.x, nextCell.y, oppositeDirection(direction))
    }

    // Create entrance and exit
    removeCellEdge(0, Math.floor(Math.random() * size), "left")
    removeCellEdge(size - 1, Math.floor(Math.random() * size), "right")
}

/**
 * Create table in document with all edges intact to be removed as maze
 * progresses.
*/
function createTable() {
    // Maze is displayed as a table where the edges of each cell in the table
    // are selectively hidden to form the walls of the maze.
    table = document.getElementById("maze");

    for (let i = 0; i < size; i++) {
        const tr = table.insertRow();
        for (let j = 0; j < size; j++) {
            tr.insertCell().classList.add("top", "bottom", "left", "right");
        }
    }
}

/**
 * Starting position for algorithm
 * @typedef {Object} cell
 * @property {number} x position of cell
 * @property {number} y position of cell
 *
 * @returns {cell}
*/
function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size)
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
    *
    * @typedef {Object} neighbors
    * @property {Object} neighbors.direction - cell object for neighbor in direction
    *
    * @returns {neighbors} - neighboring cells
*/
function findNeighbors(x, y, visitedCells, closedCells) {
    // Creates an object containing the x and y positions of
    // the 4 neighbor cells. Removes already visited cells,
    // cells outside of the grid and cells on the closed 
    // list.
    let neighbors = {
        right: { x: x + 1, y: y },
        left: { x: x - 1, y: y },
        bottom: { x: x, y: y + 1 },
        top: { x: x, y: y - 1 }
    }

    for (let n in neighbors) {
        if (!isInsideGrid(neighbors[n].x, neighbors[n].y)
            || arrayContainsOject(closedCells, neighbors[n])
            || arrayContainsOject(visitedCells, neighbors[n])) {
            delete neighbors[n];
            continue;
        }
    }
    return neighbors;
}

/**
 * Check if cell is inside the grid
 * @param {number} x - x position of cell
 * @param {number} y - y position of cell
 *
 * @returns {boolean} True if cell is inside grid, else false.
*/
function isInsideGrid(x, y) {
    return x < size && x >= 0 && y < size && y >= 0;
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
    // an x and y coordinate, within an array of such objects.
    for (let i = 0; i < array.length; i++) {
        if (array[i].x === object.x && array[i].y === object.y) {
            return true;
        }
    }
    return false;
}

/**
 * Select cell in random direction from array.
 *
 * @typedef {Object} neighbors
 * @property {Object} neighbors.direction - cell object for neighbor in direction
 *
 * @param {neighbors} neighbors - object containing potential next steps in algorithm.
 *
 * @returns {string} the direction that the algorithm will explore next. 
*/
function randomDirection(neighbors) {
    // Selects next step in the algorithm in a random direction.
    keys = Object.keys(neighbors);
    return keys[Math.floor(keys.length * Math.random())];
}


/**
 * Remove edge of cell in order to carve maze path
 * 
 * @param {number} x - x position of cell
 * @param {number} y - y position of cell
 * @param {"top" | "bottom" | "left" | "right"} edge - edge to remove
 */
function removeCellEdge(x, y, edge) {
    // Removes edge of cell at (x,y).
    document.getElementById("maze")
        .rows.item(y)
        .cells.item(x)
        .classList.remove(edge);
}

/**
 * Each cell is double-walled e.g a cell shares its left edge with its
 * neighbors right edge. Both must be removed to create a path, so this 
 * returns the opposite side of the given direction.
 *
 * @param {"top" | "bottom" | "left" | "right"} direction
 *
 * @returns {"bottom" | "top" | "right" | "left"} opposite direction.
*/
function oppositeDirection(direction) {
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

