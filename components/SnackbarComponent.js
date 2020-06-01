import React from 'react';
import {Snackbar} from 'react-native-paper';
import {connect} from 'react-redux'
import {dismissSnackbar, showSnackBar} from '../redux/actions/snackbar-actions'
const SnackbarComponent = (props) => {
  return (
    <Snackbar
      visible={props.visible}
      theme={{colors: {accent:'#fff'}}}
      onDismiss={() => {props.dismissSnackbar(null)}}
      style={{backgroundColor: '#5d11f7', zIndex: 999, marginBottom: 60}}
      action={{
        label: 'Okay',
        onPress: () => {
         props.dismissSnackbar(null)
        },
      }}>
      {props.message}
    </Snackbar>
  );
};


const mapStateToProps = (state) =>{
    const {snackbar} = state
    return snackbar
} 

export default connect(mapStateToProps,{dismissSnackbar})(SnackbarComponent)