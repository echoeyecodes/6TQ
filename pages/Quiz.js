import React, {Component} from 'react';
import {
  StyleSheet,
  BackHandler,
  View,
  ScrollView,
  AppState,
  StatusBar,
} from 'react-native';
import ActionBar from '../components/QuizComponents/action-bar';
import QuizTitle from '../components/QuizComponents/QuizTitle';
import QuizOptions from '../components/QuizComponents/QuizOptions';
import QuizDetails from '../components/QuizComponents/QuizDetails';
import UseLifeModal from '../components/QuizComponents/UseLifeModal';
import ProgressBar from '../components/QuizComponents/ProgressBar';
import LinearGradient from 'react-native-linear-gradient';
import CheckPointReached from '../components/ModalComponents/CheckPointReached';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import {ApolloConsumer, Query} from 'react-apollo';
import gql from 'graphql-tag';

const USER_MUTATION = gql`
  mutation User($lives: Int, $points: Int) {
    updateUserStats(lives: $lives, points: $points) {
      bio {
        username
      }
    }
  }
`;

const QUESTION_QUERY = gql`
  query {
    questions {
      title
      correctAnswer
      options
    }
  }
`;

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.timeoutRef;
    this.timerRef;
    this.state = {
      isDisabled: true,
      currentIndex: 0,
      time: 5,
      score: 0,
      correctAnswers: 0,
      hasFailed: false,
      lifeUsed: false,
      showLifeAnim: false,
      isLoading: false,
      question: null,
      isCorrect: null,
      lifeTimeoutValue: 5,
      lifeLeft: 0,
      questions: [],
    };
  }

  getSelectedAnswer = async (value, manual = false) => {
    this.setState({isDisabled: true});
    if (manual) {
      this.setState({isLoading: true, lifeUsed: true}, async () => {
        await this.client.mutate({
          mutation: USER_MUTATION,
          variables: {lives: -1},
        });
    }
      )}
    this.abortTimer();
    const isValid = this.assignGlobalScore(value);
    this.timeoutRef = setTimeout(() => {
      if (isValid) {
        this.checkLimitReached(this.nextQuestion);
      } else {
        this.shouldShowLifeModal();
      }
    }, 2000);
  };

  resetCache = () => {
    clearTimeout(this.timeoutRef);
    clearInterval(this.timerRef);
  };

  nextQuestion = () => {
    this.setState({isLoading: true});
    setTimeout(() => {
      this.resetCache();
      this.setState(
        {currentIndex: this.state.currentIndex + 1, isCorrect: false},
        () => {
          const currentQuestion = this.state.questions[this.state.currentIndex];
          this.setState(
            {
              question: currentQuestion,
              isLoading: false,
              isDisabled: false,
              time: 5,
            },
            () => {
              this.startTimer();
            },
          );
        },
      );
    }, 2000);
  };

  startTimer = () => {
    this.timerRef = setInterval(() => {
      if (this.state.time === 0) {
        this.getSelectedAnswer();
        return;
      }
      this.setState({time: this.state.time - 1});
    }, 1000);
  };

  proceedToScoreScreen = async () => {
    this.setState({hasFailed: false, isLoading: true});
    this.resetCache();
    this.abortLifeTimeout();
    this.abortTimer();
    await this.client.mutate({
      mutation: USER_MUTATION,
      variables: {points: this.state.score},
    });
    this.onCompleted();
  };

  useExtraLife = () => {
    this.abortLifeTimeout();
    this.setState({isLoading: true}, async () => {
      await this.client.mutate({
        mutation: USER_MUTATION,
        variables: {lives: -1},
      });
      this.setState(
        {
          isLoading: false,
          hasFailed: false,
          showLifeAnim: true,
          lifeUsed: true,
        },
        () => {
          setTimeout(() => {
            this.setState({showLifeAnim: false}, () => {
              this.checkLimitReached(this.nextQuestion)
            });
          }, 1200);
        },
      );
    });
  };

  abortLifeTimeout = () => {
    clearTimeout(this.lifeTimeout);
    clearInterval(this.lifeInterval);
    this.setState({lifeTimeoutValue: 5, hasFailed: false});
  };

  shouldShowLifeModal = () => {
    this.abortTimer();
    setTimeout(() => {
      this.setState({hasFailed: true});
      this.lifeInterval = setInterval(() => {
        this.setState({lifeTimeoutValue: this.state.lifeTimeoutValue - 1});
      }, 1000);
      this.lifeTimeout = setTimeout(() => {
        this.checkLimitReached(this.nextQuestion);
      }, 5000);
    }, 2000);
  };

  checkLimitReached = callback => {
    this.abortLifeTimeout();
    if (this.state.currentIndex === this.state.questions.length - 1) {
      this.resetCache();
      setTimeout(() => {
        this.proceedToScoreScreen();
      }, 2000);
      return;
    }
    callback();
  };

  assignGlobalScore = (value = 0) => {
    const totalScore = 25;
    if (value === this.state.question.correctAnswer) {
      this.setState({
        score: this.state.score + totalScore,
        correctAnswers: this.state.correctAnswers + 1,
        isCorrect: true,
      });
      return true;
    } else {
      this.setState({isCorrect: false});
      return false;
    }
  };

  abortTimer = () => {
    clearInterval(this.timerRef);
  };

  handleServerError = () => {
    this.setState({isLoading: false});
    alert(`Couldn't fetch recent data from the server`);
  };

  startGame = async () => {
    const currentQuestion = this.state.questions[this.state.currentIndex];
    this.setState({
      question: currentQuestion,
      isLoading: false,
      isDisabled: false,
    });
    this.startTimer();
  };

  onGameScreenExit = appState => {
    if (appState === 'background') {
      this.abortTimer();
      this.setState({isDisabled: true});
      this.prevAppState = 'background'
      return;
    } if(this.prevAppState && this.prevAppState == 'background' && appState=='active') {
      this.proceedToScoreScreen();
    }
  };

  componentDidMount() {
    AppState.addEventListener('change', this.onGameScreenExit);
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
    const {lives = 0} = this.props.route.params;
    this.setState({lifeLeft: lives, isLoading: true});
  }

  questionsFetched = ({questions}) => {
    this.setState({questions}, () => {
      if (this.state.questions.length > 0) {
        this.startGame();
      }
    });
  };

  componentWillUnmount() {
    console.log('timer aborted');
    this.abortTimer();
    this.abortLifeTimeout();
    this.backHandler.remove();
    AppState.removeEventListener('change', this.onGameScreenExit);
  }

  onCompleted = () => {
    this.setState({isLoading: false});
    this.resetCache();
    setTimeout(() => {
      this.props.navigation.navigate('Scoreboard', {
        score: this.state.score,
        percentage: Math.floor(
          (this.state.correctAnswers / this.state.questions.length) * 100,
        ),
        length: this.state.questions.length,
        correctAnswers: this.state.correctAnswers,
      });
    }, 1000);
  };

  render() {
    const {currentIndex, isDisabled, time, question} = this.state;
    const progress = Math.floor(
      (this.state.score / (25 * this.state.questions.length)) * 100,
    );

    return (
      <ApolloConsumer>
        {client => {
          this.client = client;
          return (
            <Query
              fetchPolicy="cache-and-network"
              query={QUESTION_QUERY}
              onCompleted={this.questionsFetched}>
              {({loading, error, data}) => {
                return (
                  <LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#4568DC', '#B06AB3']}
                    style={styles.container}>
                    <StatusBar
                      barStyle="dark-content"
                      backgroundColor="#B06AB3"
                    />
                    <ActionBar
                      currentIndex={currentIndex}
                      totalIndex={this.state.questions.length}
                    />
                    <ProgressBar progress={progress ? progress : 0} />
                    {this.state.isLoading && (
                      <LoadingScreen message="Loading question" />
                    )}
                    <CheckPointReached
                      continueGame={() =>
                        this.checkLimitReached(this.nextQuestion)
                      }
                      visible={this.state.hasFailed}
                      useExtraLife={this.useExtraLife}
                      score={this.state.score}
                      correctAnswer={question && question.correctAnswer}
                      lifeLeft={this.state.lifeLeft}
                      lifeUsed={this.state.lifeUsed}
                      lifeTimeoutValue={this.state.lifeTimeoutValue}
                    />
                    <UseLifeModal visible={this.state.showLifeAnim} />
                    <ScrollView
                      style={styles.scroll}
                      showsVerticalScrollIndicator={false}>
                      {this.state.question !== null && (
                        <>
                          <QuizTitle question={this.state.question.title} />
                          <View style={styles.optionsHolder}>
                            {this.state.question.options.map(
                              (option, index) => {
                                return (
                                  <QuizOptions
                                    key={index}
                                    isDisabled={isDisabled}
                                    answer={this.state.question.correctAnswer}
                                    isCorrect={this.state.isCorrect}
                                    option={option.trim()}
                                    onPress={this.getSelectedAnswer}
                                  />
                                );
                              },
                            )}
                          </View>
                        </>
                      )}
                    </ScrollView>
                    <QuizDetails
                      shouldStart={!this.state.isDisabled}
                      currentTime={time}
                      lifeLeft={this.state.lifeLeft}
                      lifeUsed={this.state.lifeUsed}
                      correctAnswer={question ? question.correctAnswer : ''}
                      useLife={this.getSelectedAnswer}
                    />
                  </LinearGradient>
                );
              }}
            </Query>
          );
        }}
      </ApolloConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f2f2',
  },
  scroll: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 70,
  },
  optionsHolder: {
    marginTop: 20,
  },
  bonusValue: {
    fontWeight: 'bold',
    fontSize: 24,
    position: 'absolute',
    zIndex: 999,
    left: 30,
    bottom: 250,
  },
});

export default Quiz;
