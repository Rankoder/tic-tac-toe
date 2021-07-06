import { array } from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.className} 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(fieldNumber, className) {
        return (
            <Square
                value={this.props.squares[fieldNumber]}
                onClick={() => this.props.onClick(fieldNumber)}
                className={className}
            />
        );
    }

    createBoard(fieldNumbers) {
        if(this.props.winnerMoves) {
            var [a, b, c] = this.props.winnerMoves;
        }

        var fieldNumber = 0;
        var maxRowAndColumn = Math.sqrt(fieldNumbers);
       
        var rowInRow = [];
        var board = [];

        for(var columnFields = 0; columnFields < maxRowAndColumn; columnFields++) {
            for(var rowFields = 0; rowFields < maxRowAndColumn; rowFields++) {
                console.log(a,b,c,fieldNumber);
                if(a === fieldNumber || b === fieldNumber || c === fieldNumber) {
                    rowInRow[fieldNumber] = this.renderSquare(fieldNumber, 'square win');
                } else {
                    rowInRow[fieldNumber] = this.renderSquare(fieldNumber, 'square');
                }
                
                fieldNumber++;
                
            }

            board.push(
                <div className="board-row">{rowInRow}</div>
            );
            rowInRow = [];
        }

        return (
            <div>{board}</div>
        );
    }

    render() {
        return (
             this.createBoard(9)
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinates: Array(9).fill(null),
            }],
            xIsNext:true,
            stepNumber: 0,
            selected: [{
                active: false,
                activeStep: null,            
            }],
            sort: true,
            winnerMoves: null,
            classNameSquare: 'square',
        };
    }

    handleClick(fieldNumber) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const tempSquares = current.squares.slice();
        const tempCoordinates = current.coordinates.slice();

        if(calculateWinner(tempSquares) || tempSquares[fieldNumber]) {
            return;
        }
        
        tempSquares[fieldNumber] = this.state.xIsNext ? 'X' : 'O';
        tempCoordinates[this.state.stepNumber] = this.showActualCoordinates(fieldNumber);
        this.setState({
            history: history.concat([{
                squares: tempSquares,
                coordinates: tempCoordinates,
            }]),   
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    showActualCoordinates(current) {
        const tableWithCoordinates = [
            '1,1',
            '1,2',
            '1,3',
            '2,1',
            '2,2',
            '2,3',
            '3,1',
            '3,2',
            '3,3',
        ]

        return tableWithCoordinates[current];
    }

    markActualMove(move) {
        if(move === this.state.stepNumber) {
            return 'actualStep';
        }

        return null;      
    }

    changeSort() {
        this.setState({
            sort: !this.state.sort,
        })              
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? 
                'Przejdz do ruchu #' + move + ' Współrzędne: (' + step.coordinates[move - 1] + ')' :
                'Przejdz na początek gry';
                
            return (
           
                <li key={move} >
                    <button onClick={() => this.jumpTo(move)} className={this.markActualMove(move)}>{desc}</button>
                </li>
            );
        });    
        
        let status;
        let winnerMoves = null;
        if (winner) {
            status = 'Wygrywa: ' + winner[0]['winner'];
            winnerMoves = winner[1]['moves'];
        } else {
            status = 'Następny gracz: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(fieldNumber) => this.handleClick(fieldNumber)}
                        winnerMoves={winnerMoves}
                    />
                </div>
                <div className="game-info">
                    {<div>{status}</div>}
                    <ol>{this.state.sort ? moves : moves.reverse()}</ol>
                    <button key='sort'
                        onClick= {() => this.changeSort()}
                    >Zmień sortowanie historii ruchów</button>
                </div>
                <div>
                  
                </div>
            </div>
        );
    }

}

// ===================================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    var winner = [];
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

    for(let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            winner = [
                {'winner' : squares[a]},
                {'moves' : lines[i]},
            ]

            return winner;           
        }
    }

    return null;
}
  