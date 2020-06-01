import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const QuizTitle = ({question}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 10
  },
  title:{
      fontFamily: 'Poppins-Regular',
      fontSize: 20,
      textAlign: 'center',
      color: '#000000'
  }
});


export default QuizTitle