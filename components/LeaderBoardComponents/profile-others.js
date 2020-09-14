import React, {useContext, memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
} from 'react-native';
import ThemeContext from '../../Context/ThemeContext';

const ProfileOthers = ({name, username, points, index, image, rank}) => {
  const {theme} = useContext(ThemeContext);
  const nameArray = name.split(' ')
  const fullName = `${nameArray[0]} ${nameArray[1].substr(0, 1)}.`
  return (
    <TouchableNativeFeedback>
      <View style={styles.container}>

        <Text style={[styles.name, styles.rank, {color: theme.foreground}]}># {rank}</Text>
        <Image source={{uri: image}} style={styles.avatar} />

        <View style={styles.bio}>
          <Text style={[styles.name, {color: theme.foreground}]}>{fullName}</Text>
          <Text style={[styles.username, {color: theme.opacity}]}>@{username}</Text>
        </View>

        <Text style={[styles.name, styles.points, {color: theme.foreground}]}>{points} points</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10
  },
  avatar:{
    width: 50,
    height: 50,
    borderRadius: 50,
    marginLeft: 10
  },
  bio:{
    flex: 1,
    marginLeft: 10
  },
  name:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15
  },
  username:{
    color: 'rgba(0,0,0,0.5)'
  },
  rank:{
    fontFamily: 'Luxia-Display'
  },
  points:{
    marginLeft: 'auto'
  }
});

export default memo(ProfileOthers);
