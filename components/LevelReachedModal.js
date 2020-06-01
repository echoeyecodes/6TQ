import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableNativeFeedback,
  Image,
} from 'react-native';
import {Portal, Modal} from 'react-native-paper';
import ThemeContext from '../Context/ThemeContext';
import {connect} from 'react-redux';
import {showMessage, dismissMessage} from '../redux/actions/message-action';

const ActionBtn = ({onDismiss}) => {
  return (
    <TouchableNativeFeedback onPress={onDismiss}>
      <View style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>Dismiss</Text>
      </View>
    </TouchableNativeFeedback>
  );
};
const LevelReachedModal = (props) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Portal>
      <Modal onDismiss={props.dismissMessage} visible={props.visible}>
        <View
          style={[styles.container, {backgroundColor: theme.background}]}>
          <Image style={styles.image} source={props.image} />

          <View style={styles.messageContainer}>
            <Text style={[styles.title, {color: theme.foreground}]}>
              {props.title}
            </Text>

            <Text style={[styles.desc, {color: theme.opacity}]}>
              {props.desc}
            </Text>
          </View>

          <ActionBtn onDismiss={props.dismissMessage} />
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('screen').height / 1.5,
    marginHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 30,
    padding: 10,
    backgroundColor: '#5d11f7',
  },
  actionBtnText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  messageContainer: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    textAlign: 'center',
  },
  desc: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

const mapStateToProps = state => state.message;
export default connect(
  mapStateToProps,
  {showMessage, dismissMessage},
)(LevelReachedModal);
