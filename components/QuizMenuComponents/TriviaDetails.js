/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment-timezone';

const triviaDetails = (
  startGame,
  amount,
  isOpen,
  maintainanceRequired,
  time,
  hasStaked,
  hasCurrentlyPlayed,
  variedTime,
) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 1, y: 0}}
        colors={['#41295a', '#2F0743']}
        style={styles.gradient}>
        <View
          style={[
            styles.indicator,
            {backgroundColor: isOpen ? '#1aa260' : '#de5246'},
          ]}
        />

        <View style={styles.root}>
          <Text style={styles.subtext}>Total Amount</Text>
          <Text style={styles.amount}>&#8358; {amount}</Text>
        </View>

        <View style={styles.root}>
          <Text style={styles.subtext}>
            {isOpen ? 'Event ends in' : 'Next round'}
          </Text>
          <Text style={[styles.amount, {fontSize: 20}]}>
            {maintainanceRequired
              ? 'TBD'
              : isOpen
              ? `${variedTime} (Active now)`
              : variedTime}
          </Text>
        </View>

        <TouchableNativeFeedback
          onPress={() => {
            if (maintainanceRequired) {
              alert("Event hasn't been scheduled. Please try again later!");
              return;
            }

            if (!hasStaked) {
              alert('You have not placed a bet for this event');
              return;
            }
            if (!isOpen) {
              alert('Event has not started yet. Be chill!');
              return;
            }
            if (hasCurrentlyPlayed) {
              alert(
                'You have already participated in this event. Wait for the next one!',
              );
              return;
            }
            startGame();
          }}>
          <View style={styles.startBtn}>
            <Text style={styles.startBtnText}>START</Text>
          </View>
        </TouchableNativeFeedback>
      </LinearGradient>
    </View>
  );
};

const MemoizedTriviaDetails = ({data, startGame, userActivity}) => {
  const {amount, isOpen, maintainanceRequired, time} = data;
  const {hasStaked, hasCurrentlyPlayed} = userActivity;

  const interval = useRef(null);
  const [timer, setTime] = useState({min: 0, sec: 0});
  const formattedMinutes = `0${timer.min <= 0 ? '0' : timer.min}`.slice(-2);
  const formattedSeconds = `0${timer.sec <= 0 ? '0' : timer.sec}`.slice(-2);

  const variedTime =
    isOpen && timer.minutes <= 0 && timer.seconds <= 0
      ? 'ACTIVE NOW'
      : `${formattedMinutes}:${formattedSeconds}`;

  const beginTimer = () => {
    const date = new Date(time);
    const end = moment(date);
    interval.current = setInterval(() => {
      const start = moment();

      const minutes = moment.duration(end.diff(start)).minutes();
      const seconds = moment.duration(end.diff(start)).seconds();

      setTime({min: minutes, sec: seconds});
    }, 1000);
  };

  useEffect(() => {
    beginTimer();

    return () => {
      clearInterval(interval.current);
    };
  }, [data]);

  const memoized = useMemo(
    () =>
      triviaDetails(
        startGame,
        amount,
        isOpen,
        maintainanceRequired,
        time,
        hasStaked,
        hasCurrentlyPlayed,
        variedTime,
      ),
    [
      startGame,
      amount,
      isOpen,
      maintainanceRequired,
      time,
      hasStaked,
      hasCurrentlyPlayed,
      variedTime,
    ],
  );

  return memoized;
};
const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('screen').height / 4,
    marginHorizontal: 10,
  },
  root: {
    marginVertical: 5,
  },
  gradient: {
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  subtext: {
    textAlign: 'center',
    color: 'white',
  },
  amount: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  startBtn: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    width: 150,
  },
  startBtnText: {
    textAlign: 'center',
    color: '#fff',
  },
});

export default MemoizedTriviaDetails;
