import React, { useState, useEffect, useRef }  from 'react'
import {View, StyleSheet, Text, TouchableWithoutFeedback, Animated} from 'react-native'
import Svg, {Circle, Rect} from 'react-native-svg'

const CircularProgressBar = ({children, shouldStart, duration, color}) =>{
    const [animatedValue] = useState(new Animated.Value(0))
    const AnimatedCircle = Animated.createAnimatedComponent(Circle)

    const animRef = useRef(null)

    animRef.current = Animated.timing(animatedValue,{
        toValue: 100,
        duration: duration,
        useNativeDriver: true,
    })

    const length = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [Math.PI * 2, 0]
    })
    const multiLength = Animated.multiply(length, 25)


    useEffect(() =>{
        if(shouldStart){
           animatedValue.setValue(0)
           animRef.current.start()
        }else if(!shouldStart){
            animRef.current.stop()
        }
    }, [shouldStart])
    return(
        <View style={styles.progressContainer}>
        <Svg style={styles.svg} height="60" width="60">
            <Circle
            cx={30}
            cy={30}
            fill='none'
            r={25}
            stroke='rgba(0,0,0,0.1)'
            strokeWidth='5'
            />
          <AnimatedCircle
            cx="30"
            cy="30"
            r={25}
            fill='none'
            strokeLinecap='round'
            strokeDasharray={Math.PI * 2* 25}
            stroke={color}
            strokeDashoffset={multiLength}
            strokeWidth="5"
            fill="none"
          />
        </Svg>
        <View style={styles.content}>
        {children}
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    progressContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg:{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        transform:[{rotateZ: '270deg'}]
    },
    content:{
        backgroundColor: '#fff'
    }
})
export default CircularProgressBar