import React, { useCallback, useState, useRef} from 'react';
import './App.css';
import produce from 'immer';

const numRows = 34;
const numColumns = 34;

const Grid = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numColumns), () => 0))
    }
    return rows;
  });


  const [running, setRunning] = useState(false);

//keeps state of runningRef up to date with running for callback
  const runningRef = useRef(running);
  runningRef.current = running 

// to use Recursion use Callback function passing an empty array as second param to ensure its only called once
  const runSimulation = useCallback(() => {
    //base case
    if (!runningRef.current) {
        return;
    }
    //simulate
    setTimeout(runSimulation, 1000);
  }, [])

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numColumns}, 21px)`
    }}>
      {grid.map((rows, i) => 
        rows.map((columns, j) => 
          <div 
            key = {'${i}-${j}'}
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
  )
}

export default Grid;