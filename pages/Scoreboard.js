import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, Text, TouchableNativeFeedback} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CircularProgressbar from '../components/ScoreboardComponent/Circular ProgressBar';
import LoadingScreen from '../components/QuizComponents/LoadingScreen';
import ThemeContext from '../Context/ThemeContext';


const TopIcon = () => {
  return (
    <View style={styles.checkIconHolder}>
      <FontAwesome name="check" color="white" size={20} />
    </View>
  );
};

const ScoreComponent = ({percentage, length, correctAnswers}) => {
  const {theme} = useContext(ThemeContext)
  return (
    <View style={styles.justify}>
      <Text style={[styles.percentage, {
        color: theme.foreground
      }]}>{percentage}%</Text>
      <Text style={[styles.questionsCompleted, {color: theme.foreground}]}>
        {correctAnswers} of {length}
      </Text>
    </View>
  );
};

const MessageComponent = ({msg, subMsg}) => {
  const {theme} = useContext(ThemeContext)
  return (
    <View style={styles.messageComponent}>
      <Text style={[styles.percentage, {color: theme.foreground}]}>{msg}</Text>
      <Text style={[styles.messageDesc, {color: theme.opacity}]}>{subMsg}</Text>
    </View>
  );
};

const XPComponent = ({score}) => {
  const {theme} = useContext(ThemeContext)
  return (
    <View style={[styles.xpComponent, styles.justify, {backgroundColor: theme.background}]}>
      <Text style={[styles.xpValue, {color: '#5d11f7'}]}>+{score} XP</Text>
    </View>
  );
};

const ProceedBtn = ({navigation}) => {
  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Index',
            },
          ],
        })
      }>
      <View style={[styles.proceedBtn, styles.justify]}>
        <Text style={styles.proceedBtnText}>PROCEED</Text>
      </View>
    </TouchableNativeFeedback>
  );
};
const CompletedScreen = ({route, navigation}) => {
  const {score, percentage, length, correctAnswers} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const {theme} = useContext(ThemeContext)

  const msg = percentage <= 49 ? 'You can do better!' : 'You are awesome!';
  const subMsg =
    'Congratulations on your points earned. Remember, the battle is not over yet';

  useEffect(() => {
    
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      {isLoading && <LoadingScreen />}
      <CircularProgressbar
        percentile={percentage}
        duration={1500}
        color="#5d11f7">
        <TopIcon />
        <ScoreComponent
          percentage={percentage}
          correctAnswers={correctAnswers}
          length={length}
        />
        <XPComponent score={score} />
      </CircularProgressbar>
      <MessageComponent msg={msg} subMsg={subMsg} />
      <ProceedBtn navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFF1F5',
  },
  checkIconHolder: {
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#5d11f7',
    position: 'absolute',
    top: -10,
  },
  justify: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontFamily: 'congrat',
    fontSize: 24,
    textAlign: 'center',
  },
  questionsCompleted: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.5)',
  },
  messageComponent: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  messageDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
  xpComponent: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    elevation: 1,
    shadowColor: '#fff',
    shadowRadius: 1,
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
  xpValue: {
    color: '#00D7CA',
    fontFamily: 'alata',
  },
  proceedBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 15,
    backgroundColor: '#5d11f7',
    borderRadius: 5,
  },
  proceedBtnText: {
    color: '#fff',
    fontFamily: 'normal-default',
  },
});

export default CompletedScreen
