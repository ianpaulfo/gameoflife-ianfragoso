import React, { useCallback, useState, useRef} from 'react';
import './App.css';
import produce from 'immer';

const numRows = 34;
const numColumns = 34;

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
  
    return rows;
  };

var generation = 0

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
  
// to use Recursion use Callback function passing an empty array as second param to ensure its only called once
  const runSimulation = useCallback(() => {
    //base case
    updateGeneration(generation);
    if (!runningRef.current) {
        return;
    }
    setGrid((g) => {
        return produce(g, gridCopy => {
            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numColumns; j++) {
                    let neighbors = 0;
                    //count the number of live neighbors
                    operations.forEach(([x, y]) => {
                        const newI = i + x;
                        const newJ = j + y;
                        if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns) {
                          neighbors += g[newI][newJ];
                        }
                    });
                    //implement rules for game of life
                    if (neighbors < 2 || neighbors > 3) {
                        gridCopy[i][j] = 0;
                    } else if (g[i][j] === 0 && neighbors === 3) {
                        gridCopy[i][j] = 1;
                    }
                }
            }
        });
    });
    setTimeout(runSimulation, 100);
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
            {running ? "stop" : "start"}
        </button>
        <button
            onClick={() => {
            console.log("clear button pressed")

            setGrid(generateEmptyGrid());
            }}
        >
            clear
        </button>
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numColumns}, 21px)`
            }}>
            {grid.map((rows, i) => 
                rows.map((columns, j) => 
                <div 
                    key = {`${i}-${j}`}
                    onClick={() => {
                        //making a mutable change by generating a new grid
                        const newGrid = produce(grid, gridCopy => {
                            gridCopy[i][j] = grid[i][j] ? 0 : 1;
                        })
                        setGrid(newGrid)
                    }}
                    style={{
                    width: 20, 
                    height: 20, 
                    backgroundColor: grid[i][j] ? "green": undefined,
                    border: "solid 1px black"
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