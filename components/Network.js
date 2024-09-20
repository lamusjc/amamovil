import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const url = 'https://amaapi-steph.herokuapp.com/';
// const url = 'http://192.168.0.110:3000/';
export default class Network extends Component {
  constructor(props) {
    super(props);
  }

  async get(endpoint): Promise<any> {
    const token = await AsyncStorage.getItem('_t');
    return new Promise((resolve, reject) => {
      fetch(url + endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .then((response) => {
          response.text().then((res) => {
            let data = JSON.parse(res);
            // console.log(res);
            if (data.status == 200) {
              resolve(data);
            } else {
              reject(data);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async post(endpoint, data): Promise<any> {
    const token = await AsyncStorage.getItem('_t');
    return new Promise((resolve, reject) => {
      fetch(url + endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          response.text().then((res) => {
            let data = JSON.parse(res);
            // console.log(res);
            if (data.status == 200) {
              resolve(data);
            } else {
              reject(data);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async put(endpoint, data): Promise<any> {
    const token = await AsyncStorage.getItem('_t');
    return new Promise((resolve, reject) => {
      fetch(url + endpoint, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          response.text().then((res) => {
            let data = JSON.parse(res);
            // console.log(res);
            if (data.status == 200) {
              resolve(data);
            } else {
              reject(data);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async delete(endpoint): Promise<any> {
    const token = await AsyncStorage.getItem('_t');
    return new Promise((resolve, reject) => {
      fetch(url + endpoint, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
        .then((response) => {
          response.text().then((res) => {
            let data = JSON.parse(res);
            // console.log(res);
            if (data.status == 200) {
              resolve(data);
            } else {
              reject(data);
            }
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUrl() {
    return url;
  }
}
