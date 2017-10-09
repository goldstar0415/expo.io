import React from 'react';
import { ImageEditor, StyleSheet, Text, View, Image, Button, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { ImagePicker } from 'expo';
import vision from 'react-cloud-vision-api';
import mergeImages from 'merge-images';

export default class App extends React.Component {
  state = {
    image: null,
    isMask: false
  };

  componentWillMount() {
    vision.init({auth: 'AIzaSyCLt-6tFD-Pk8LTQMjG8al_itbAT2M6m_Q'})
  }

  render() {
    let { image, isMask } = this.state;

    return (
      <View style={styles.container}>
      {image &&
        <Image source={{ uri: image }} style={styles.backgroundImage}>
          {
            isMask?(<Image source={require('./resource/image/Electric_meter_mask.png')} style={styles.mask}/>):null
          }
        </Image>
      }
        <Button
          title="Select Image"
          onPress={this._pickImage}
        />
        <Button
          title="Mask Image"
          onPress={this._maskImage}
        />
        <Button
          title="Send Image"
          onPress={this._sendImage}
        />

      </View>
    );
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  _maskImage = async () => {
    this.setState({
      isMask: true
    })
  };

  _sendImage = async () => {
    if (this.state.image == null) {
      Alert.alert("Notice", "Please select image first")
      return
    }

    const req = new vision.Request({
      image: new vision.Image({
        path:  this.state.image
          // url: 'https://scontent-nrt1-1.cdninstagram.com/hphotos-xap1/t51.2885-15/e35/12353236_1220803437936662_68557852_n.jpg'
      }),
      features: [
        new vision.Feature('TEXT_DETECTION', 100)
      ]
    })
    vision.annotate(req).then((res)=>{
      Alert.alert("Resut", JSON.stringify(res.responses))
    }, (e)=>{
      Alert.alert("Error", e)
    })   
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    width: Dimensions.get('window').width - 100,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mask: {
    position:'absolute'
  }
});
