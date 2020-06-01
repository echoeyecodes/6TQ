import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Modal, Portal} from 'react-native-paper'
import CheckPointReached from '../ModalComponents/CheckPointReached'
import FailedCheckPoint from '../ModalComponents/FailedCheckpoint'
const ModalPromt = ({livesLeft, visible, continueGameLife, continueGameCheckPoint, wrongAnswer,endGame, checkPointScore, ...props}) => {
  return (
    <Portal>
    <Modal dismissable visible={visible} >
      <View style={styles.container}>
          {wrongAnswer === null || wrongAnswer === false ?    <CheckPointReached {...props} endGame={endGame} checkPointScore={checkPointScore} continueGame={continueGameCheckPoint}/> : <FailedCheckPoint livesLeft={livesLeft} checkPointScore={checkPointScore} continueGame={continueGameLife} endGame={endGame} />}
      </View>
    </Modal>
  </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    flexDirection: 'row'
  },
});


export default ModalPromt