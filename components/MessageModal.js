import React, {useContext} from 'react';
import {Portal, Modal} from 'react-native-paper';
import {View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import ThemeContext from '../Context/ThemeContext';

const MessageModal = ({visible, onDismiss, children}) => {
  const {theme} = useContext(ThemeContext);
  return (
    <Portal>
      <Modal onDismiss={onDismiss} visible={visible}>
        <View
          style={[styles.container, {backgroundColor: theme.background}]}>
          <View style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
              <View style={{alignItems: 'center'}}>
                <Image
                  style={styles.image}
                  source={require('../assets/credit-card.png')}
                />
              </View>

              {children}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('screen').height / 1.5,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
});

export default MessageModal;
