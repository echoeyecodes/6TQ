import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


const HappeningNow = ({ value }) => <Text style={styles.nowText}>{value}</Text>

const Divider = () => {
  return (
    <View style={styles.divider}>
      <Text style={styles.timeDigit}>:</Text>
    </View>
  )
}

const TimeDigit = ({ value, info }) => {
  return (
    <View>
      <Text style={styles.timeDigit}>{value}</Text>
      <Text style={[styles.timeDigit, { fontFamily: 'poppins-regular', fontSize: 14 }]}>{info}</Text>
    </View>
  )
}


const TimerComponent = ({ event, data, value, valid }) => {
  const { days, hours, minutes, seconds } = data
  return (
    <View style={styles.timerContainer}>
      {valid ? <HappeningNow value='TBD' /> : false ? <HappeningNow value={value} /> : <>
        <TimeDigit value={`0${days <= 0 ? 0 : days}`.slice(-2)} info='DAYS' />
        <Divider />
        <TimeDigit value={`0${hours <= 0 ? 0 : hours}`.slice(-2)} info='HOURS' />
        <Divider />
        <TimeDigit value={`0${minutes <= 0 ? 0 : minutes}`.slice(-2)} info='MINUTES' />
        <Divider />
        <TimeDigit value={`0${seconds <= 0 ? 0 : seconds}`.slice(-2)} info='SECONDS' />
      </>}


    </View>
  )
}

const styles = StyleSheet.create({
  timerContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  timeDigit: {
    color: '#fff',
    fontFamily: 'poppins-semibold',
    fontSize: 20,
    textAlign: 'center'
  },
  nowText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold'
  }
})

export default TimerComponent