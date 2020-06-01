import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableNativeFeedback} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import TimerComponent from '../TimerComponent';

const BeginButton = ({startGame}) => {
  return (
    <TouchableNativeFeedback onPress={startGame}>
      <View style={styles.beginBtn}>
        <Text style={styles.beginBtnText}>QUIZ UP!</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

class QuizDetails extends Component {
  /* console.log(moment.duration(end.diff(moment())).seconds()) */

  constructor(props) {
    super(props);

    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isOpen: false,
      event: null
    };
  }

  componentDidMount() {
    this.beginTimer()
  }

  beginTimer = () =>{
    this.interval = setInterval(() => {
      const event = '1234567885'
      const start = moment().utc();
      const end = moment.unix(event.datetime);

      const days = moment.duration(end.diff(start)).days();
      const hours = moment.duration(end.diff(start)).hours();
      const minutes = moment.duration(end.diff(start)).minutes();
      const seconds = moment.duration(end.diff(start)).seconds();
      this.setState({days, hours, minutes, seconds, event});
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startGame = () => {
    const isOpen = false
    if (isOpen) {
      this.props.startGame();
      return;
    }
    alert(`This event is not active yet`);
  };

  render() {
    const {days, minutes, seconds, hours} = this.state;
    return (
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={['#e53935', '#e35d5b']}
        style={styles.container}>
        <Text style={styles.subTitle}>LIVE EVENT STARTS</Text>

        <TimerComponent
          valid={
            false &&
            days <= 0 &&
            hours <= 0 &&
            minutes <= 0 &&
            seconds <= 0
          }
          value="HAPPENING NOW!"
          event={this.state.event}
          data={{days, minutes, seconds, hours}}
        />
        <BeginButton startGame={this.startGame} />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    padding: 10,
  },
  subTitle: {
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: 'Luxia-Display',
    fontSize: 16,
    color: '#fff',
  },
  beginBtn: {
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: '#fff',
    marginVertical: 10,
  },
  beginBtnText: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});

export default QuizDetails
