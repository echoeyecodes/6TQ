import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
const QuizOptions = ({option, answer, onPress, isDisabled, isCorrect}) => {
  const [isSelected, setIsSelected] = useState({color: 'black', backgroundColor: 'white'});

  useEffect(() =>{
    setIsSelected({color: 'black', backgroundColor: 'white'});
  }, [option])
  
  const handleClick = () => {
    onPress(option);
      if(option === answer){
        setIsSelected({color: 'white', backgroundColor: '#2BEE65'});
        return
      }
      setIsSelected({color: 'white', backgroundColor: '#FA6868'});
  };
  return (
    <TouchableNativeFeedback onPress={() => isDisabled || handleClick()}>
    <View
      style={{
        ...styles.container,
        backgroundColor: isCorrect && option == answer ? '#2BEE65' : isSelected.backgroundColor,
      }}
      rippleColor="rgba(0, 0, 0, 0.8)"
    >
      <Text style={{...styles.option, color: isCorrect && option ==answer ? '#fff' : isSelected.color}}>{option}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5
  },
  option: {
    fontFamily: 'Poppins-Regular'
  }
});

export default QuizOptions;
