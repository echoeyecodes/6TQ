import React, { useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableNativeFeedback } from 'react-native';
import data from '../earn-coin-util'
import ThemeContext from '../Context/ThemeContext';
const EarnCoins = ({theme, onOptionSelected, username}) => {
  return (
    <View>
      {data.map((item, index) =>
        <TouchableNativeFeedback key={index} onPress={() => onOptionSelected(index, username )}>
          <View style={styles.container}>
            <View style={[styles.imageHolder, { backgroundColor: item.color }]}>
              <Image style={styles.image} source={item.image} />
            </View>

            <View style={styles.descriptionHolder}>
              <Text style={[styles.title, {color: theme.foreground}]}>{item.title}</Text>
              <Text style={[styles.description, {color: theme.foreground}]}>{item.description}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10
  },
  descriptionHolder: {
    flex: 1,
    marginLeft: 10
  },
  imageHolder: {
    width: 80,
    height: 80,
    borderRadius: 5,
    padding: 20,
  },
  image: {
    width: null,
    height: null,
    flex: 1
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
  description: {
    color: 'rgba(0,0,0,0.5)'
  }
});


export default EarnCoins
