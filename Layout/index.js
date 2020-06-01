import React, {Component} from 'react';
import {Appbar} from 'react-native-paper';
import {StyleSheet, StatusBar, View} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import ThemeContext from '../Context/ThemeContext';
import {connect} from 'react-redux';

class Layout extends Component {
  constructor(props) {
    super(props);
   
  }
  componentDidMount() {
    
  }

  componentWillUnmount() {}

  render() {
    return (
      <ThemeContext.Consumer>
        {({theme, toggleTheme}) => (
          <View style={[styles.container, {backgroundColor: theme.background}]}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={theme.background}
            />
            <Appbar.Header
              style={[styles.appbar, {backgroundColor: theme.background}]}>
              <Appbar.Content
                style={{marginLeft: 0}}
                title={this.props.title}
              />{/* 
              <Appbar.Action
                icon={({size, color, ...props}) => (
                  <Feather
                    {...props}
                    name="help-circle"
                    size={size}
                    color={color}
                  />
                )}
                onPress={() => {}}
              /> */}
              <Appbar.Action
                icon={({size, color, ...props}) => (
                  <Ionicons
                    {...props}
                    name="ios-color-palette"
                    size={size}
                    color={color}
                  />
                )}
                onPress={toggleTheme}
              />
            </Appbar.Header>

            {this.props.children}
          </View>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    elevation: 0,
  },
});

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  {},
)(Layout);
