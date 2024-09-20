# Movil Amazon - React Native

Crear nuevo proyecto:
```sh
$ react-native init myfirstapp
```

Instalar paquetes:
```sh
$ npm install
```

Iniciar app en android:
```sh
$ react-native run-android
```


Iniciar app en ios:
```sh
$ react-native run-ios
```

Build apk en android sin las keys de playstore:
```sh
$ react-native run-android --variant=release
```

Si sale error de react-native-vector-icons y otros:
```sh
$ npm install --save react-native-vector-icons
$ npm install --save react-native-image-picker
$ npm install --save react-native-simple-toast
$ npm install --save @react-native-community/image-editor
$ react-native link react-native-vector-icons
$ react-native link react-native-image-picker
$ react-native link react-native-simple-toast
$ react-native link @react-native-community/image-editor
```