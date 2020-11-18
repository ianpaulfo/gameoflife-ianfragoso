import React, { useCallback, useState, useRef} from 'react';
import './App.css';
import produce, { setAutoFreeze } from 'immer';



var numRows = 25;
var numColumns = 25;

var generation = 0

//represents the number of neighbor variability
const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0]
  ];

const generateEmptyGrid = () => {    
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numColumns), () => 0));
    }
    console.log("rows:", rows)
    return rows;
};


const Grid = () => {
  const [grid, setGrid] = useState(() => {
      return generateEmptyGrid();
  });
  
  
  const updateGeneration = useCallback(() => {
    generation += 1;
  }, [])


  const [running, setRunning] = useState(false);
//keeps state of runningRef up to date with running for callback
  const runningRef = useRef(running);
  runningRef.current = running;
 
// Algorithm to generate new generations of cells using rules provided:
// Recursion method is used as a callback function 
// BigO notation -> Log(n)
  const runSimulation = useCallback(() => { 
    //base case
    updateGeneration(generation);
    if (!runningRef.current) {
        return;
    } 
    setGrid((currentGrid) => {
        //double-buffer function to measure every cell in that grid against Conway’s rules, create a new Grid accordingly, then replace the old Grid with the new one.
        return produce(currentGrid, gridCopy => {
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numColumns; j++) {
                    let neighbors = 0;
                    //count the number of live neighbors
                    operations.forEach(([x, y]) => {
                        const newI = i + x;
                        const newJ = j + y;
                        if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                          neighbors += currentGrid[newI][newJ];
                        }
                    });
                    //based on rules for game of life, cell life is determined by checking number of neighbor requirements
                    if (neighbors < 2 || neighbors > 3) {
                        gridCopy[i][j] = 0;
                    } else if (currentGrid[i][j] === 0 && neighbors === 3) {
                        gridCopy[i][j] = 1;
                    }
                }
            }
        });
    });
    setTimeout(runSimulation, 100);
    console.log("Simulation Generation:", generation)
  }, []);

  const runSingleSimulation = useCallback(() => {
    updateGeneration(generation);
    if (!runningRef.current) {
        return;
    } 
    setGrid((currentGrid) => {
        return produce(currentGrid, gridCopy => {
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numColumns; j++) {
                    let neighbors = 0;
                    operations.forEach(([x, y]) => {
                        const newI = i + x;
                        const newJ = j + y;
                        if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                          neighbors += currentGrid[newI][newJ];
                        }
                    });
                    if (neighbors < 2 || neighbors > 3) {
                        gridCopy[i][j] = 0;
                    } else if (currentGrid[i][j] === 0 && neighbors === 3) {
                        gridCopy[i][j] = 1;
                    }
                }
            }
        });
    });
    setTimeout(100);
    console.log("Single Generation -> currently:", generation)
  }, []);


  return (
    <div>
        <button
            onClick={() => {
            console.log("start button pressed")
            setRunning(!running); 
            if (!running) {
                runningRef.current = true;
                runSimulation();
            }
        }}
        >
            {running ? "Pause" : "Start"}
        </button>

        <button
            onClick={() => {
                console.log("Single generation button pressed")
                if (running) {
                    setRunning(!running)
                    return
                }
                runningRef.current = true;
                runSingleSimulation()
            }}
        >
            Single Generation
        </button>

        <button
            onClick={() => {
                if (numRows >= 55) {
                    numRows = 15
                    numColumns = 15
                    return
                }
                console.log("grid size button pressed", numRows, numColumns)
                generation = 0
                numRows += 10
                numColumns += 10
                setGrid(generateEmptyGrid());
                if (running) {
                    setRunning(!running)
                    return
                }                
            }}
        >
            Grid Size:{numColumns}x{numRows}
        </button>

        <button
            onClick={() => {
            console.log("clear button pressed")
            generation = 0
            setGrid(generateEmptyGrid());
            if (running) {
                setRunning(!running)
                return
            }
            }}
        >
            Clear
        </button>

        <button
            onClick={() => {
                if (running) {
                    return
                }
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                rows.push(Array.from(Array(numColumns), () => Math.random() > .85 ? 1 : 0));
    }
            generation = 0  
            setGrid(rows);
            }}
        >
            Random Seed
        </button>

        <div className="grid" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numColumns}, 23px)`
            }}>
            {grid.map((rows, i) => 
                rows.map((columns, j) => 
                <div 
                    key = {`${i}-${j}`}
                    onClick={() => {
                        if (running) {
                            return
                        }
                        //making a mutable change by generating a new grid
                        const newGrid = produce(grid, gridCopy => {
                            gridCopy[i][j] = grid[i][j] ? 0 : 1;
                        })
                        setGrid(newGrid)
                    }}
                    style={{
                    width: 20, 
                    height: 20, 
                    backgroundColor: grid[i][j] ? "green": "yellow",
                    border: "solid 2px black"
                    }} 
                />
                ))
            }
        </div> 
        <h2>Generation: {generation}</h2>
    </div>
    
  )
}

export default Grid;