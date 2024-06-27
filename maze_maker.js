// I would rather this not be a global variable but for a programme this simple,
// I think this is the most intuitive soltion. For a bigger project, I would 
// consider perhaps modularising, creating a class with this variable within
// the scope or moving it and other variables to a config file.
let size = 0;

function buildMaze() {

    // The maze is treated as a grid of cells size x size large. Starting
    // at a random cell, one of its neighbors is chosen at random. Then the
    // edge between those two cells is removed, creating a path. This continues
    // until a cell is reached that has previously visited neighbors. Then 
    // the cell is removed from the visitedCells array and added to the 
    // closedCells array and is never visited again. The algorithm then steps
    // back to the previous cell and tries a different random direction. 
    // It terminates when the visitedCells array is empty.

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

function randomGridPosition() {
    // Starting position for algorithm
    return {
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size)
    };
}

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

function isInsideGrid(x, y) {
    return x < size && x >= 0 && y < size && y >= 0;
}

function arrayContainsOject(array, object) {
    // Helper function for matching a cell i.e an object with 
    // an x and y coordinate, within an array of such objects.
    for (let i = 0; i < array.length; i++) {
        if (array[i].x === object.x && array[i].y === object.y) {
            return true;
        }
    }
    return false;
}

function randomDirection(origin) {
    // Selects next step in the algorithm in a random direction.
    keys = Object.keys(origin);
    return keys[Math.floor(keys.length * Math.random())];
}


function removeCellEdge(x, y, edge) {
    // Removes edge of cell at (x,y).
    document.getElementById("maze")
        .rows.item(y)
        .cells.item(x)
        .classList.remove(edge);
}

function oppositeDirection(direction) {
    // Each cell is double-walled e.g a cell shares its left edge with its
    // neighbors right edge. Both must be removed to create a path, so this 
    // returns the opposite side of the given direction.
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

