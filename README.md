<p align="center">
  <img src="./assets/128x128.png" height="128">
</p>

<h2 align="center">
  Pomodoro
</h2>

<p align="center">
  A simple yet featureful pomodoro in the tray/menubar
</p>

<p align="center">
  <a href="https://ci.appveyor.com/project/KeziahMoselle/pomodoro">
    <img alt="Windows Release Badge" src="https://img.shields.io/appveyor/ci/keziahmoselle/pomodoro/master.svg?label=build%3Awindows&style=flat-square">
  </a>
    
  <a href="https://travis-ci.org/KeziahMoselle/pomodoro">
    <img alt="MacOS Release Badge" src="https://img.shields.io/travis/KeziahMoselle/pomodoro.svg?label=build%3Amac&style=flat-square">
  </a>
  
  <a href="https://github.com/KeziahMoselle/pomodoro/releases/latest">
    <img alt="Version" src="https://img.shields.io/github/tag/KeziahMoselle/pomodoro.svg?label=version&style=flat-square">
  </a>

  <a href="https://github.com/KeziahMoselle/pomodoro/commits/master"> 
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/KeziahMoselle/pomodoro/master.svg?style=flat-square">
  </a>
  
</p>

<p align="center">
  <img width="90%" src="./.github/cover.png" alt="Pomodoro cover">
</p>

## [Download](https://github.com/KeziahMoselle/pomodoro/releases/latest)

## Features

- ⏱️ Change work time and pause time
- 🔔 Notifications
- 🔥 Streak
- 📊 Statistics
- 🔁 Cycles

## Coming soon

- [🚩 Goals](https://github.com/KeziahMoselle/pomodoro/issues/21)
- [🧭 Feature Discovery](https://github.com/KeziahMoselle/pomodoro/issues/13)

> See [Project v1.0.0](https://github.com/KeziahMoselle/pomodoro/projects/1)

## Want to contribute ?

### Prerequisites
* Have [Node.js](https://nodejs.org/en/)  installed (> 8)

### Steps

1. Clone the repository
```sh
> git clone https://github.com/KeziahMoselle/pomodoro.git
```
2. Install dependencies :
```sh
> cd pomodoro && npm install
```
3. Run the app in `development` mode
```sh
> npm run dev
```

### Project tree

```
|-- pomodoro
    |-- assets              <-- Assets for the app
    |-- build               <-- The React build
    |-- dist                <-- Binaries will be generated here
    |-- public
    |   |-- app.js          <-- Electron main process
    |   |-- icons.js
    |   |-- index.html
    |   |-- preload.js      <-- Inject Node modules to the renderer process
    |   |-- store.js        <-- Store
    |   |-- icons
    |-- src                 <-- React App
```

## How to build ?

```sh
> npm run build
```
The binaries will be created in the `dist` folder.

## Built With

* [Electron](https://electronjs.org/) - framework for creating native applications with web technologies
* [React](https://reactjs.org) - A JavaScript library for building user interfaces


## License

This project is licensed under the [MIT License](LICENSE).
