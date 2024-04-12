<!-- Banner Image -->

[![CS105](/.style/header.png)](https://crossyroad105.netlify.app/)

<p align="center">
  <a aria-label="try crossy road in the browser" href="https://crossyroad105.netlify.app/"><b>Try in the Browser</b></a>
</p>

---

For our final project in **CS105 - Computer Graphics**, I propose to create a browser-based remake of the popular game "Crossy Road".

## Models

This project adapts the Voxel Graphics style, using [MagicaVoxel](https://ephtracy.github.io/), an open-source project, to create voxel-based models for characters and environment elements.

If you'd like to see someone else in the game or have any relevant ideas, please open an issue!

## Stack

- [Expo](http://expo.io) (ios, android, web)
- [React Native for web](https://baconbrix.gitbook.io/react-native-web/) (web)
- [React Native](http://reactnative.dev/) (ios, android)
- [THREE.js](https://threejs.org/) for rendering
- [GSAP](https://greensock.com/) for animating
- [Webpack](https://www.npmjs.com/package/@expo/webpack-config)

## Getting Started

Clone this repository:

```
  git clone https://github.com/Dev-Aligator/Crossy-ComGraphics.git
```

Next, install the dependencies:

```
  npm i --legacy-peer-deps
```

To start the web version of the game, run:

```
  npx expo start --web
```

If you wish to build the web version, use the following command:

```
  npx expo export:web
```
