import React, {Component} from 'react'
import TokenService from '../../services/token-service'
import UserContext from '../../contexts/UserContext'
import config from '../../config';
import './Learning.css';

class Learning extends Component{
    //create state
  state = {
    error: null,
    results: false,
  }
 // add constructor
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
  }
 //use context
  static contextType = UserContext

   //component did mount / language/head fetch request
  componentDidMount(){
    return fetch(`${config.API_ENDPOINT}/language/head`,
    {headers: {
        'authorization':`bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => res.json())
    .then(res => {
      this.context.setNextWord(res);
    })
    .catch(err => this.setState({error: err}));
  }


  // submit form / language/guess fetch request
  submitForm(e) {
    e.preventDefault();

    if(this.state.results){
      this.setState({results: !this.state.results})
      setTimeout(() => document.getElementById('learn-guess-input').focus(), 250);
    } else {
    this.context.setCurrentWord(this.context.nextWord)
      this.context.setGuess(e.target.userinput.value)
      //integral to the input box being hidden
    this.setState({results: !this.state.results})

    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization':`bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({guess: e.target.userinput.value})
    })
      .then(res => res.json())
      .then(json => {
        this.context.setNextWord(json);
        this.showFeedback();
        document.getElementById('feedback-overlay').focus();
        document.getElementById('learn-guess-input').value = '';
      });
    }
  }



// feedback if correct/incorrect
  showFeedback() {
    const el = document.getElementById('feedback-overlay');
    el.classList.remove('invisible');
    setTimeout(() => {el.classList.add('invisible')}, 2500);
  }

  //clearFeedback?? 
  clearFeedback() {
    document.getElementById('feedback-overlay').classList.add('invisible');
    document.getElementsByClassName('btn')[0].focus();
  }

  //get the response text 
  getResponse() {
    if(this.context.nextWord)
     if(typeof this.context.nextWord.isCorrect !== 'undefined') {
      if(this.context.nextWord.isCorrect) {
        return 'You were correct! :D';
      } else {
        return 'Good try, but not quite right :(';
      }
    }
  }

  //'the correct response was'
  getResponseFeedback(){
    if(this.context.nextWord && typeof this.context.nextWord.isCorrect !== 'undefined'){
        return `The correct translation for ${this.context.currentWord.nextWord} was ${this.context.nextWord.answer} and you chose ${this.context.guess}!`
    }
  }

 //get button text - make button 'try another word' or 'submit your answer' 
  getButtonText(){
    if(this.state.results){
      return 'Try another word!'
    } else return 'Submit your answer';
  }


  render(){
    return (
      <div className="learning">
        <h2>Translate the word:</h2><span>{this.context.nextWord ?  this.state.results ? this.context.currentWord.nextWord : this.context.nextWord.nextWord : null}</span>
        <h3 id="feedback-overlay" className="invisible" onClick={this.clearFeedback}>{this.getResponse()}</h3>
        <div className="DisplayScore">
          <p>Your total score is: {this.context.nextWord ? this.context.nextWord.totalScore : null}</p>
        </div>
        <div className="DisplayFeedback">
          <p className={this.state.results ? '' : 'hidden'}>{this.getResponseFeedback()}</p>
        </div>
        <form onSubmit={this.submitForm}>
          <label htmlFor="learn-guess-input" className={this.state.results ? 'hidden' : ''}>What's the translation for this word?</label>
          <input autoFocus={true} id="learn-guess-input" name="userinput" type="text" required={this.state.results ? false : true} className={this.state.results ? 'hidden' : ''} maxLength="25"></input>
          <button className="btn" type="submit">{this.getButtonText()}</button>
        </form>
        <p className="word-count">You have answered this word correctly {this.state.results ? this.context.currentWord.wordCorrectCount : this.context.nextWord ? this.context.nextWord.wordCorrectCount : null} times.</p>
        <p className="word-count">You have answered this word incorrectly {this.state.results ? this.context.currentWord.wordIncorrectCount : this.context.nextWord ? this.context.nextWord.wordIncorrectCount : null} times.</p>
      </div>
    );
  }
}

export default Learning
