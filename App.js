import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }

  _takeImage(){
    if (this.camera) {
      this.camera.takePictureAsync().then(data => {
        const image = {
          uri: data.uri,
          type: 'image/jpeg',
          name: 'myImage' + '-' + Date.now() + '.jpg'
        }

        const imgBody = new FormData()
        imgBody.append('image', image);

        // Here We need to put backend API for OCR and that API need to return OCR's result
        // On client side, It will send the image data to server

        
        const url = '';
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          body: imgBody
        }).then(res=>res.json()).then(result => {
          Alert("Result", result)
        }).catch(error=>{
          Alert("Error", "Error occured")
        })
      });
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View/>
    } else if (hasCameraPermission === false) {
      return <Text>No access to Camera</Text>
    } else {
      return (
        <View style={styles.container}>
          <Camera 
            ref={ref => {
              this.camera = ref;
            }} style={styles.camera} type={this.state.type}>
            <Image source={require('./image/mask.png')} style={styles.mask}/>
            <View style={styles.bottom}>
              <TouchableOpacity onPress={()=>this._takeImage()}>
                <Image source={require('./image/take.png')}  style={styles.take}/>
              </TouchableOpacity>
              <View style={styles.rebase}>
                <TouchableOpacity onPress={()=>{
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                  <Image source={require('./image/cycle.png')} style={styles.rebaseImage}/>
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  mask: {
    width: Dimensions.get('window').width-50,
    height: Dimensions.get('window').width-50
  },
  bottom: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    flexDirection: 'row',
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  take: {
    width:80,
    height: 80,
  },
  rebase: {
    position: 'absolute',
    right: 10
    // marginRight: 10,
  },
  rebaseImage: {
    width: 40,
    resizeMode: 'contain'
  }
});
