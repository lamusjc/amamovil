import React, {Component, useState} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  TouchableHighlight,
  NativeModules,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Input, Header, Text, Image} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Network from './Network';
import Toast from 'react-native-simple-toast';
import {Picker} from '@react-native-community/picker';
import ImageEditor from '@react-native-community/image-editor';

export default class Article extends React.Component {
  unsubscribe = this.props.navigation.addListener('focus', (e) => {
    // Prevent default action
    this.initAll();
  });
  isValid = false;
  isLoading = false;
  network = new Network();
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      price: 0,
      quantity: 0,
      photo: null,
      b64: null,
      selectedValue: '',
      category: [],
      valid: this.isValid,
      loading: this.isLoading,
    };
  }

  initAll() {
    this.setState({
      category: [],
    });
    this.getInfo();
  }

  getInfo() {
    this.network.get('info').then(
      (res) => {
        this.getCategory();
      },
      (err) => {
        this.props.navigate.navigation('Login');
      },
    );
  }

  convertirB64(response) {
    const fileUri =
      Platform.OS === 'android' ? `file://${response.path}` : response.uri;
    ImageEditor.cropImage(fileUri, {
      offset: {x: 0, y: 0},
      size: {width: 1024, height: 768},
      // displaySize: {width: 1000, height: 1000},
      // resizeMode: 'contain',
    })
      .then((res) => {
        RNFS.readFile(res, 'base64').then((result) => {
          this.setState({
            b64: 'data:image/jpeg;base64,' + result,
          });
        });
      })
      .catch((err) => {
        // console.log(err);
      });

    // RNFS.readFile(response.uri, 'base64').then((res) => {
    //   this.setState({
    //     b64: 'data:image/jpeg;base64,' + res,
    //   });
    // });
  }

  handleInput(value, target) {
    this.setState(
      {
        [target]: value,
      },
      () => {
        if (
          this.state.title == '' ||
          this.state.descripcion == '' ||
          this.state.price <= 0 ||
          this.state.quantity <= 0
        ) {
          // console.log('No es valido');
          this.isValid = false;
        } else {
          // console.log('Es valido');
          this.isValid = true;
        }

        this.setState({
          valid: this.isValid,
        });
      },
    );
  }

  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    Alert.alert(
      '',
      'Choose your option',
      [
        {
          text: 'CAMERA',
          onPress: () => {
            ImagePicker.launchCamera(options, (response) => {
              if (response.uri) {
                this.convertirB64(response);
                this.setState({photo: response});
              }
            });
          },
          style: 'cancel',
        },
        {
          text: 'LIBRARY STORAGE',
          onPress: () => {
            ImagePicker.launchImageLibrary(options, (response) => {
              if (response.uri) {
                this.convertirB64(response);
                this.setState({photo: response});
              }
            });
          },
        },
        {
          text: 'CLOSE',
          onPress: () => {
            console.log('Close');
          },
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  componentDidMount() {
    // this.initAll();
  }

  getCategory() {
    this.network.get('category').then(
      (res) => {
        res.data.map((value) => {
          this.setState({
            category: [...this.state.category, value],
          });
        });
      },
      (err) => {
        // console.log(err);
      },
    );
  }

  render() {
    const {photo, b64} = this.state;

    let categoryItems = this.state.category.map((category, i) => {
      return (
        <Picker.Item
          key={i}
          value={category.category_id}
          label={category.category_name}
        />
      );
    });
    return (
      <View>
        <Text h4 style={{textAlign: 'center'}}>
          Post your article
        </Text>

        <Input
          name="title"
          onChangeText={(value) => {
            this.handleInput(value, 'title');
          }}
          placeholder="Title"
          maxLength={99}
        />
        <Input
          name="description"
          onChangeText={(value) => {
            this.handleInput(value, 'description');
          }}
          placeholder="Description"
          multiline={true}
          maxLength={499}
        />
        <View style={styles.container}>
          <Picker
            selectedValue={this.state.selectedValue}
            onValueChange={(value) => this.setState({selectedValue: value})}>
            {categoryItems}
          </Picker>
        </View>

        <Input
          name="price"
          onChangeText={(value) => {
            this.handleInput(value, 'price');
          }}
          // style={styles.textArea}
          placeholder="Price"
          keyboardType="numeric"
          maxLength={10}
        />
        <Input
          name="quantity"
          onChangeText={(value) => {
            this.handleInput(value, 'quantity');
          }}
          // style={styles.textArea}
          placeholder="Quantity"
          keyboardType="numeric"
          maxLength={3}
        />

        <View>
          {photo && (
            <Image source={{uri: b64}} style={{width: 150, height: 100}} />
          )}
          <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
        </View>
        <TouchableHighlight
          style={{
            padding: 5,
          }}>
          <Button
            title="Save article"
            disabled={!this.state.valid || this.state.loading}
            onPress={() => {
              Toast.show('Loading...', 3000, Toast.BOTTOM);
              this.isLoading = true;
              this.setState({
                loading: this.isLoading,
              });
              this.network.post('post', this.state).then(
                (res) => {
                  this.isLoading = false;
                  this.props.navigation.navigate('Home');
                  this.setState({
                    loading: this.isLoading,
                  });
                  alert(res.message);
                  this.props.navigation.navigate('Main');
                },
                (err) => {
                  this.isLoading = false;
                  this.setState({
                    loading: this.isLoading,
                  });
                  alert(err.message);
                },
              );
            }}
          />
        </TouchableHighlight>
        <TouchableHighlight
          style={{
            padding: 5,
          }}>
          <Button
            title="Back to main"
            onPress={() => {
              this.props.navigation.navigate('Main');
            }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textAreaContainer: {
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 0,
    paddingTop: 0,
  },
});
