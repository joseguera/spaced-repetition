import React, { Component } from 'react';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';

const UserContext = React.createContext({
  user: {},
  error: null,
  // add language contexts
  language: null,
  words: null,
  currentWord: {},
  nextWord: {},
  guess: null,
  totalScore: null,


  setError: () => { },
  clearError: () => { },
  setUser: () => { },
  processLogin: () => { },
  processLogout: () => { },
  // language functions 
  setLanguage: () => { },
  setWords: () => { },
  setCurrentWord: () => { },
  setNextWord: () => { },
  setGuess: () => { },
  setTotalScore: () => { },
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    const state = { user: {}, error: null };

    const jwtPayload = TokenService.parseAuthToken();

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      };

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle);
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets();
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets();
    TokenService.clearCallbackBeforeExpiry();
  }

  // add set functions 

  setLanguage = language => {
    this.setState({ language });
  };

  setWords = words => {
    this.setState({ words });
  };

  setCurrentWord = currentWord => {
    this.setState({ currentWord });
  };

  setNextWord = nextWord => {
    this.setState({ nextWord });
  };
  setGuess = guess => {
    this.setState({ guess });
  };

  setTotalScore = totalScore => {
    this.setState({ totalScore });
  };


  setError = error => {
    console.error(error);
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setUser = user => {
    this.setState({ user });
  };

  processLogin = authToken => {
    TokenService.saveAuthToken(authToken);
    const jwtPayload = TokenService.parseAuthToken();
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    });
    IdleService.regiserIdleTimerResets();
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken();
    });
  };

  processLogout = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({});
  };

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({ idle: true });
  };

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then(res => {
        TokenService.saveAuthToken(res.authToken);
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken();
        });
      })
      .catch(err => {
        this.setError(err);
      });
  };

  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      //add state items
      language: this.state.language,
      words: this.state.words,
      currentWord: this.state.currentWord,
      nextWord: this.state.nextWord,
      guess: this.state.guess,
      totalScore: this.state.totalScore,

      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
      //add set functions 
      setLanguage: this.setLanguage,
      setWords: this.setWords,
      setCurrentWord: this.setCurrentWord,
      setNextWord: this.setNextWord,
      setGuess: this.setGuess,
      setTotalScore: this.setTotalScore,
    };
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}