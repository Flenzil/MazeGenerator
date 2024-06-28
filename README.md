# Maze
The maze is treated as a grid of cells size x size large. Starting
at a random cell, one of its neighbors is chosen at random. Then the
edge between those two cells is removed, creating a path. This continues
until a cell is reached that has previously visited neighbors. Then 
the cell is removed from the visitedCells array and added to the 
closedCells array and is never visited again. The algorithm then steps
back to the previous cell and tries a different random direction. 
It terminates when the visitedCells array is empty.

To run, simply open index.html in a broswer window.

# Notes
The size of the grid is a global variable. It would be preferable to 
avoid such globals but in such a simple programme, the alternatives are
more obtuse (modularising, creating a class with "size" in the top level,
outsourcing such variables to a config file).

