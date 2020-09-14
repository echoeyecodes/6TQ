import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import ThemeContext from "../../Context/ThemeContext";

const {width} = Dimensions.get('screen')
const TopProfile = ({ points, name, username, image, rank }) => {
  const {theme} = useContext(ThemeContext)
  const position = {
    width: (width /5) + 30,
    height: (width /5) + 30,
    borderRadius: ((width /5) + 30) /2
  };
  let color;
  switch (rank) {
    case 1:
      color = "#E72A76";
      break;
    case 2:
      color = "#00E388";
      break;
    case 3:
      color = "#FFA50B";
      break;
  }

  useEffect(() =>{

  }, [])
  return (
    <View style={[styles.container, styles.justify]}>
      <View style={[styles.imageHolder, styles.justify]}>
          <View style={[styles.positionHolder, styles.justify, {backgroundColor: color}]}>
              <Text style={[styles.position, {color: '#fff'}]}>{rank}</Text>
          </View>
        <Image
          source={{uri: image}}
          style={[styles.image, rank === 1 && { borderRadius: 50 }]}
        />
      </View>

      <View style={styles.profileInfo}>
        <Text style={[styles.name, {color: theme.foreground}]}>{name}</Text>
      </View>

      <View style={styles.pointsHolder}>
        <Text style={[styles.points, {color: theme.foreground}]}>{points} points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5
  },
  imageHolder: {
    width: width/5,
    height: width/5,
  },
  image: {
    width: null,
    height: null,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 50
  },
  justify:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionHolder: {
    padding: 5,
    borderRadius: 50,
    width: 20,
    height: 20,
    zIndex: 999,
    position: 'absolute',
    bottom: -10,
  },
  position: {
    color: "white",
    textAlign: "center",
  },
  profileInfo: {
    marginTop: 10
  },
  name: {
    fontFamily: "Poppins-SemiBold",
    textAlign: 'center',
    fontSize: 16
  },
  points: {
    fontFamily: "Poppins-Regular"
  }
});

export default TopProfile;
