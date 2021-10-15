import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={"square " + (props.isWinner ? "cellwinner" : null)}  
      onClick={() => props.onClick()} >
      {props.value}
    </button>
  );
}

function Order(props){
  return(
   <div className="checkbox_group">
     <input type="checkbox" onChange={props.toReturnData}></input>
     <label>Ascending</label>
   </div>
   );
}

function calculareWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a],
            arrayWin: lines[i]};
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinner={this.props.winnerSquares.includes(i)}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRowCell(cellInit) { 
    let cells = [];
      for (let r = cellInit; r < cellInit + 3 ; r++ ) 
        cells.push(this.renderSquare(r));
    return cells;
  }

  renderRow(cellInit) {
    return (
    <div className="board-row" key={cellInit}>
      {this.renderRowCell(cellInit)}
    </div>);
  }

  renderRows(){
    let rows = [];
    for( let rs = 0; rs < 3; rs++){
       rows.push(this.renderRow(rs * 3));
    }
    return rows;
  } 

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderRows()}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), cell: null }],
      xIsNext: true,
      stepNumber: 0,
      ascending: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculareWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares, cell: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleChangeAscending = () => {
    this.setState({ascending: !this.state.ascending});
  }
   
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculareWinner(current.squares);
    const moves = history.map((step, move,array) => {
      const desc = move ? "Go to move #" + move + ", " + 
                   array[move].squares[array[move].cell] + " on col: " + 
                   ((array[move].cell % 3) + 1) + ", row: "+ (Math.floor(array[move].cell / 3 + 1))
                   : "Go to game start";
      return (
        <li key={move}>
          <button className="" onClick={() => this.jumpTo(move)}>
          {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + winner;
      
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerSquares={winner ? winner.arrayWin : []}
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
          />
        </div>
        <div className="game-info">
          <Order type="checkbox" toReturnData={this.handleChangeAscending}/>
          <div>{status}</div>
          <ol>{this.state.ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
