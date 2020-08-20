import React, {useState, useContext} from 'react';
import {Portal, Modal} from 'react-native-paper';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  TouchableNativeFeedback,
} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ThemeContext from '../Context/ThemeContext';

const USER_MUTATION = gql`
  mutation User($coins: Int) {
    addUserToEvent(coins: $coins) {
      bio {
        username
      }
    }
  }
`;

const PlaceBetModal = ({visible, coinsLeft, onDismiss, onBetPlaced}) => {
  const [value, setValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateUser, {data}] = useMutation(USER_MUTATION);
  const {theme} = useContext(ThemeContext);

  const placeBet = async () => {
    const regex = parseInt(value);
    const invalid = [null, '', ',', '-'].includes(regex);
    if (invalid || isNaN(regex)) {
      alert('Invalid Input');
      return;
    }
    if (value < 20) {
      alert('Minimum stake is 20');
      return;
    }
    if (regex > coinsLeft) {
      alert(
        'You do not have enough coins for this bet. Buy more coins or watch an ad!',
      );
      return;
    }
    setIsLoading(true);
    try {
      await updateUser({variables: {coins: regex}});
      onBetPlaced('Your bet has been placed successfully');
    } catch (error) {
      onBetPlaced("Your transaction couldn't be completed");
    }
    setIsLoading(false);
    setValue(null);
  };
  return (
    <Portal>
      <Modal onDismiss={onDismiss} visible={visible}>
        <View style={[styles.container, {backgroundColor: theme.background}]}>
          <View style={styles.betContainer}>
            <Text style={[styles.subText, {color: theme.foreground}]}>
              Place your bet
            </Text>

            <TextInput
              value={value}
              keyboardType="numeric"
              onChangeText={amount => setValue(amount)}
              placeholder="Amount e.g 25"
              placeholderTextColor={theme.opacity}
              style={[
                styles.textInput,
                {color: theme.foreground, borderColor: theme.opacity},
              ]}
            />

            <TouchableNativeFeedback onPress={() => !isLoading && placeBet()}>
              <View style={styles.doneBtn}>
                <Text
                  style={[
                    styles.doneBtnText,
                    {
                      color: isLoading
                        ? 'rgba(93, 17, 247, 0.5)'
                        : 'rgba(93, 17, 247, 1)',
                    },
                  ]}>
                  Done
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('screen').height / 2,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  betContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 5,
    borderRadius: 5,
  },
  doneBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 10,
  },
  doneBtnText: {
    fontFamily: 'Poppins-SemiBold',
  },
  subText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
  },
});

export default PlaceBetModal;
