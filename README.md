# Fretris 

<img align="right" width="200" height="200" src="https://raw.githubusercontent.com/Prior99/tetris/master/images/logo.png">

[![pipeline status](https://gitlab.com/prior99/tetris/badges/master/pipeline.svg)](https://github.com/Prior99/tetris)
[![coverage report](https://gitlab.com/prior99/tetris/badges/master/coverage.svg)](https://github.com/Prior99/tetris)

A multiplayer tetris clone written in Typescript.
The game uses WebRTC Data channels for truely serverless multiplayer in the browser (Peer-To-Peer).

[![play](https://raw.githubusercontent.com/Prior99/tetris/master/images/button.png)](https://prior99.gitlab.io/tetris)

## Features

This game has the following features:

 * Singleplayer
 * Peer-To-Peer multiplayer
 * SRS rotation system
 * Lighting system
 * Leaderboards

<p align="center">
    <img width="300" src="https://raw.githubusercontent.com/Prior99/tetris/master/images/screenshot-1.png">
    <img width="300" src="https://raw.githubusercontent.com/Prior99/tetris/master/images/screenshot-2.png">
</p>

## Multiplayer

Multiplayer is possible using WebRTC. The players send garbage lines to each other which are cancellable.

<p align="center">
    <img width="600" src="https://raw.githubusercontent.com/Prior99/tetris/master/images/screenshot-4.png">
</p>

<br>

## Contributing

Contributions are welcome. Pull-Requests and Issues are happily accepted.

### Building, Testing and Linting

Yarn is used instead of NPM, so make sure it is installed (`npm i -g yarn`).

The assets need to be built using Aseprite.

All necessary steps are included in the Makefile:

```
make
```

should suffice.


## Contributors

 - Frederick Gnodtke
