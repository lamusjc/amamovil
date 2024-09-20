import React, {Component} from 'react';
import {
  View,
  Button,
  TouchableHighlight,
  Modal,
  StyleSheet,
} from 'react-native';
import {Input, Header, Text, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Network from './Network';

export default class Register extends React.Component {
  isValid = false;
  network = new Network();

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      lastname: '',
      username: '',
      password: '',
      admin: false,
      valid: this.isValid,
      loading: false,
      modal: false,
      users_code: '',
    };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(value, target) {
    this.setState(
      {
        [target]: value,
      },
      () => {
        if (
          this.state.name == '' ||
          this.state.lastname == '' ||
          this.state.username == '' ||
          this.state.password == ''
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
                          this.props.navigation.navigate('Login');
                          alert(res.message);
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
            Register
          </Text>
        </Header>
        <Input
          name="name"
          onChangeText={(value) => {
            this.handleInput(value, 'name');
          }}
          placeholder="Name"
        />
        <Input
          name="lastname"
          onChangeText={(value) => {
            this.handleInput(value, 'lastname');
          }}
          placeholder="Lastname"
        />
        <Input
          name="username"
          onChangeText={(value) => {
            this.handleInput(value, 'username');
          }}
          placeholder="Email"
          leftIcon={<Icon name="user" size={24} color="black" />}
        />
        <Input
          name="password"
          onChangeText={(value) => {
            this.handleInput(value, 'password');
          }}
          placeholder="Password"
          secureTextEntry={true}
          leftIcon={{type: 'font-awesome', name: 'chevron-left'}}
        />
        <CheckBox
          title="Admin?"
          checked={this.state.admin}
          onPress={() => this.setState({admin: !this.state.admin})}
        />
        <TouchableHighlight
          style={{
            padding: 5,
          }}>
          <Button
            disabled={!this.state.valid || this.state.loading}
            title="Save account"
            onPress={() => {
              this.setState({
                loading: true,
              });
              this.network.post('register', this.state).then(
                (res) => {
                  this.setState({
                    loading: false,
                  });
                  // alert(res.message);
                  this.setState({modal: true});
                },
                (err) => {
                  this.setState({
                    loading: false,
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
            title="Back"
            onPress={() => {
              this.props.navigation.navigate('Login');
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
