import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Svg, {Circle, Path, Line} from 'react-native-svg';
import Animated, {Easing, call, eq} from 'react-native-reanimated';
const {width, height} = Dimensions.get('screen');
const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  debug,
  stopClock,
  block,
  concat,
  multiply,
  add,
  divide,
} = Animated;

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.translateY = new Value(360);
  }

  componentDidMount() {}

  render() {
    const newWidth = height / 2;
    const newHeight = height / 2;
    const radius = newWidth / 2 - 1;
    return (
      <Animated.View style={[styles.container]}>
        <Svg style={styles.svg} height={newHeight} width={newWidth}>
          <Circle
            cx={newWidth / 2}
            cy={newWidth / 2}
            fill="none"
            r={radius}
            stroke="black"
            strokeWidth={2}
          />
          <Path stroke="#000000" d={`M${radius} ${0} L${radius} ${radius}`} />
          <Path stroke="#000000" d={`M${0} ${radius} L${radius} ${radius}`} />
          <Path
            stroke="#000000"
            d={`M${radius} ${radius + radius} L${radius} ${radius}`}
          />
          <Path
            stroke="#000000"
            d={`M${radius + radius} ${radius} L${radius} ${radius}`}
          />

          <View style={styles.box}>
            <View style={styles.boxItem}>
              <View style={styles.item}>
                <View style={styles.singleItem}>
                  <View style={styles.singleItemContent}>
                        <Text style={styles.singleItemContentText}>Free lives</Text>
                  </View>
                </View>
                
                <View style={styles.singleItem}>
                  <View style={styles.singleItemContent}>
                        <Text style={styles.singleItemContentText}>Free lives</Text>
                  </View>
                </View>

                 <View style={styles.singleItem}>
                  <View style={styles.singleItemContent}>
                        <Text style={styles.singleItemContentText}>Free lives</Text>
                  </View>
                </View>

                <View style={styles.singleItem}>
                  <View style={styles.singleItemContent}>
                        <Text style={styles.singleItemContentText}>Free lives</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Svg>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  box: {
    flexWrap: 'wrap',
  },
  boxItem: {
    width: '100%',
    height: '100%',
  },
  svg: {
    
  },
  item: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    flexDirection: 'row',
    flexWrap:'wrap'
  },
  singleItem: {
    width: '50%',
    height: '50%'
  },
  singleItemContent:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  singleItemContentText:{
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    letterSpacing: 10
  }
});
