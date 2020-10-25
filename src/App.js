import React from 'react';
import './App.css';
import Grid from './Grid';


class App extends React.Component {
  constructor () {
    super ();
    this.state = {
      generations: 0,
    }
  }

  render () {
    return (
      <div className="App">
        <h1>Conway's Game of Life</h1>
        <Grid></Grid>
        <h2>Generations: {this.state.generations}</h2>
      </div>
      )
    }
  }



export default App;
