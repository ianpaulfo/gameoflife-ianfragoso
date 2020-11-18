import React from 'react';
import './App.css';
import Grid from './Grid';


class App extends React.Component {
  constructor () {
    super ();
  }

  render () {
    return (
      <div className="App">
        <h1>Conway's Game of Life</h1>
        <div className="grid">
          <Grid></Grid>
        </div>
        <div>
          <h2>Rules:</h2>
          <p>Any live cell with two or three live neighbours survives.</p>
          <p>Any dead cell with three live neighbours becomes a live cell.</p>
          <p>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</p>
          <p>!Life, finds a way!</p>
        </div>
      </div>
      )
    }
  }



export default App;
