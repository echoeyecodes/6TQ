import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView, Image, Dimensions, TouchableNativeFeedback } from 'react-native'
import Layout from '../Layout/index'

const { width, height } = Dimensions.get('screen')
const ExploreItem = () => {
    return (
        <View style={styles.exploreItem}>
            <Image style={styles.exploreItemImage} source={require('../assets/entertainment.jpg')} />

            <View style={[styles.exploreItemDescHolder, styles.justify]}>
                <Text style={styles.exploreItemTitle}>Art & Desgin</Text>
                <Text style={styles.exploreItemDesc}>Fuchia knows it all. But do you? Take the quiz!</Text>
            </View>

            <TouchableNativeFeedback>
                <View style={styles.playNowBtn}>
                    <Text style={styles.playNowBtnText}>Play Now!</Text>
                    <Text style={styles.playNowRequirement}>2 lives</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

class Explore extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Layout title='Explore'>
                {() => {
                    return (
                        <View style={styles.container}>
                            <ScrollView showsHorizontalScrollIndicator={false} pagingEnabled horizontal>
                                <ExploreItem />
                                <ExploreItem />
                            </ScrollView>

                        </View>
                    )
                }}
            </Layout>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 10,
        marginVertical: 20,
    },
    justify: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    exploreItem: {
        width: width - 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 10
    },
    exploreItemImage: {
        width: '100%',
        height: height / 3,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    exploreItemTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center'
    },
    exploreItemDesc: {
        color: 'rgba(0,0,0,0.4)',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    exploreItemDescHolder: {
        marginHorizontal: 10,
        marginTop: 30
    },
    playNowBtn: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        padding: 5,
        backgroundColor: '#5d11f7',
        borderRadius: 20
    },
    playNowBtnText: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16
    },
    playNowRequirement: {
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    }
})
export default Explore