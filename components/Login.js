import React, {Component} from 'react';
import {
  View,
  Button,
  TouchableHighlight,
  StyleSheet,
  Modal,
} from 'react-native';
import {Input, Header, Text} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Network from './Network';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';

export default class Login extends React.Component {
  isValid = false;
  network = new Network();
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      valid: this.isValid,
      loading: false,
      modal: false,
    };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(value, target) {
    this.setState(
      {
        [target]: value,
      },
      () => {
        if (this.state.username == '' || this.state.password == '') {
          this.isValid = false;
        } else {
          this.isValid = true;
        }

        this.setState({
          valid: this.isValid,
        });
      },
    );
  }

  login() {
    Toast.show('Loading...', 3000, Toast.BOTTOM);
    this.setState({
      loading: true,
    });
    this.network.post('login', this.state).then(
      (res) => {
        AsyncStorage.setItem('_t', res.data.token);
        this.setState({
          loading: false,
        });
        this.props.navigation.navigate('Home');
        alert(res.message);
      },
      (err) => {
        this.setState({
          loading: false,
        });
        if (err.status == 405) {
          this.setState({modal: true});
          // alert(err.message);
        } else {
          alert(err.message);
        }
      },
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({modal: false});
          }}>
          <View style={stylesModal.centeredView}>
            <View style={stylesModal.modalView}>
              <Text style={stylesModal.modalText}>
                Please, write the code sent to your email
              </Text>
              <Input
                name="users_code"
                onChangeText={(value) => {
                  this.handleInput(value, 'users_code');
                }}
                keyboardType="numeric"
                maxLength={6}
              />
              <View style={{flexDirection: 'row'}}>
                <TouchableHighlight
                  style={{
                    padding: 5,
                  }}>
                  <Button
                    color={'blue'}
                    title="Save"
                    onPress={() => {
                      const body = {
                        username: this.state.username,
                        users_code: this.state.users_code,
                      };

                      this.network.put('register', body).then(
                        (res) => {
                          this.setState({
                            modal: false,
                          });
                          alert(res.message);
                          this.login();
                        },
                        (err) => {
                          alert(err.message);
                        },
                      );
                    }}></Button>
                </TouchableHighlight>
                <TouchableHighlight
                  style={{
                    padding: 5,
                  }}>
                  <Button
                    title="Close"
                    onPress={() => {
                      this.setState({
                        modal: false,
                      });
                    }}></Button>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
        <Header>
          <Text h4 style={{color: 'white', flexWrap: 'nowrap'}}>
            Login
          </Text>
        </Header>
        <Input
          onChangeText={(value) => {
            this.handleInput(value, 'username');
          }}
          placeholder="Email"
          leftIcon={<Icon name="user" size={24} color="black" />}
        />
        <Input
          onChangeText={(value) => {
            this.handleInput(value, 'password');
          }}
          placeholder="Password"
          secureTextEntry={true}
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        />

        <TouchableHighlight
          style={{
            padding: 5,
          }}>
          <Button
            title="Login"
            disabled={this.state.loading}
            onPress={() => {
              this.login();
            }}
          />
        </TouchableHighlight>

        <TouchableHighlight
          style={{
            padding: 5,
          }}>
          <Button
            title="Not account? Register here"
            onPress={() => {
              this.props.navigation.navigate('Register');
            }}
          />
        </TouchableHighlight>

        <TouchableHighlight
          style={{
            padding: 5,
          }}>
          <Button
            title="GO HOME ARTICLE"
            onPress={() => {
              this.props.navigation.navigate('Home');
            }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const stylesModal = StyleSheet.create({
  centeredView: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
