import React from 'react';
import Modal from './modals/Modal';
import GameOverModal from './modals/Game_over_modal';

class Keypad extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            guessNum: [],
            secretNum: [],
            numAttempts: 10,
            showModal: true,
            table: [],
            win: false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
    }

    componentDidMount() {
        this.handleNewCode();
    }

    async handleNewCode() {
        const url = "https://www.random.org/integers/?num=4&min=0&max=7&col=1&base=10&format=plain&rnd=new";
        const response = await fetch(url);
        // if(!response.ok) throw new Error(`Error! status: ${response.status}`);
        const data = await response.text();
        const arr = data.split("\n");
        const newArr = arr.slice(0, arr.length - 1)
        this.setState({secretNum: newArr});
        console.log(`This is the secret code ${this.state.secretNum}`);
    }

    handleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    handleRestart() {
        this.setState({guessNum: []});
        this.setState({numAttempts: 10});
        this.setState({table: []});
        this.setState({win: false});
        this.handleNewCode();
    }

    handleEnter() {
        const numExact = this.handleNumExactMatches();
        const numNear = this.handleNumNearMatches(); 

        // if the guess code is not at least 4 numbers
        if(this.state.guessNum.length < 4) {
            alert("Minimum 4 digit code require");
        } // The player had guessed a correct number and its correct location
        else if(this.state.secretNum.join("") === this.state.guessNum.join("")) {
            this.setState({win: true})
            console.log("you win");
        } else {
            // The player has a incorrect guess
            this.setState({numAttempts: this.state.numAttempts - 1})
            if(this.state.numAttempts <= 1) {
                console.log("you lose")
                return;
            }
            this.setState({table: this.state.table.concat([[this.state.guessNum, numExact, numNear]])})
            this.handleClear();
            console.log("try again");
        }
    }

    handleClick(e) {
        if(this.state.guessNum.length < 4) {
            this.setState({guessNum: this.state.guessNum.concat([e.currentTarget.value])});
        }
    }

    handleDelete(idx) {
        return (e) => {
            const newList = this.state.guessNum.filter((num, i) => i !== idx);
            this.setState({guessNum: newList});
        }
    }

    handleClear() {
        // console.log(typeof(this.state.secretNum))
        this.setState({guessNum: []});
    }

    handleNumExactMatches() {
        let counter = 0;
        for(let i = 0; i < this.state.guessNum.length; i++) {
            if(this.state.guessNum[i] === this.state.secretNum[i]) counter++
        }
        return counter;
    }

    handleNumNearMatches() {
        // The player had guess a correct number (number exist but not at the right location)
        let counter = 0;
        for(let i = 0; i < this.state.guessNum.length; i++) {
            const secretCode = this.state.secretNum;
            const currNum = this.state.guessNum[i];
            if(secretCode.includes(currNum) && secretCode[i] !== currNum) {
                counter++
            }
        }
        return counter;
    }

    render() {
        const idx = this.state.guessNum.length - 1;
        return (
            <div className="keypad-outer-container">
                <div id="hello">
                    <h1>Guess the secret code</h1>
                    {this.state.guessNum.length ? this.state.guessNum : "????"}
                    <div className="number-button-container">
                        <button id="button1" onClick={this.handleClick} value="1">1</button>
                        <button id="button2" onClick={this.handleClick} value="2">2</button>
                        <button id="button3" onClick={this.handleClick} value="3">3</button>
                    </div>
                    <div className="number-button-container">
                        <button id="button4" onClick={this.handleClick} value="4">4</button>
                        <button id="button5" onClick={this.handleClick} value="5">5</button>
                        <button id="button6" onClick={this.handleClick} value="6">6</button>
                    </div>
                    <div className="number-button-container">
                        <button id="button7" onClick={this.handleClick} value="7">7</button>
                        <button id="button0" onClick={this.handleClick} value="0">0</button>
                        {/* <button id="buttonD" onClick={this.handleDelete(idx)}>Delete</button> */}
                    </div>
                    <div className="enter-clear-delete-container">
                        <button id="buttonD" onClick={this.handleDelete(idx)}>Delete</button>
                        <button id="buttonE" onClick={this.handleEnter}>Enter</button>
                        <button id="buttonC" onClick={this.handleClear}>Clear</button>
                    </div>
                </div>

                <div className="feedback-container">
                    <h1 className="attempt-header">Attempts Remaining: {this.state.numAttempts}</h1>
                    {this.state.showModal ? <Modal handleModal={this.handleModal}/> : ""}
                    {this.state.numAttempts <= 0 || this.state.win ? <GameOverModal handleRestart={this.handleRestart} win={this.state.win}/> : ""}
                    <div>
                        {this.state.table.slice().reverse().map((arr, i) => {
                            return(
                                <ul key={i}>
                                    <li>Incorrect Guess: {arr[0]}</li>
                                    <li>Exact Matches: {arr[1]}</li>
                                    <li>Near Matches: {arr[2]}</li>
                                </ul>
                            )
                        })}
                    </div>
                </div>

            </div>
        )
    }
}

export default Keypad;