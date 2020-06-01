import React, { useState, useEffect }  from 'react'
import {View, StyleSheet, Text, TouchableWithoutFeedback, Animated} from 'react-native'
import Svg, {Circle, Rect} from 'react-native-svg'

const CircularProgressBar = ({children, percentile, duration, color}) =>{
    const [animatedValue] = useState(new Animated.Value(0))
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)


    const length = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [Math.PI * 2, 0]
    })
    const multiLength = Animated.multiply(length, 75)


    useEffect(() =>{
        Animated.timing(animatedValue,{
            toValue: percentile,
            duration: duration,
            useNativeDriver: true,
        }).start()
    }, [percentile])
    return(
        <View style={styles.progressContainer}>
        <Svg style={styles.svg} height="170" width="170">
            <Circle
            cx={85}
            cy={85}
            fill='none'
            r={75}
            stroke='rgba(0,0,0,0.1)'
            strokeWidth='10'
            />
          <AnimatedCircle
            cx="85"
            cy="85"
            r={75}
            fill='none'
            strokeLinecap='round'
            strokeDasharray={Math.PI * 2* 75}
            stroke={color}
            strokeDashoffset={multiLength}
            strokeWidth="10"
            fill="none"
          />
        </Svg>
        {children}
      </View>
    )
}

const styles = StyleSheet.create({
    progressContainer:{
        width: 170,
        height: 170,
        justifyContent: 'center',
        alignItems: 'center'
    },
    svg:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        transform:[{rotateZ: '270deg'}]
    }
})
export default CircularProgressBar