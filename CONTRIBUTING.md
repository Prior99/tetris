# Contributing

Typescript is used, so try to stick to strict typings and method signatures.

## Architecture

The application is divided into four major parts:

 * Graphics
 * Components
 * Networking
 * Game

In addition to that, utilities, typings, leaderboard and logic for loading resources exists.

The Game and Networking parts export a controller class (`Game` and `Networking`) for interfacing with it.

### Graphics

Handles the Canvas 2D graphics drawing. Is utilized from withing the components.

Each graphics target (own game, remote game, tetrimino preview) resides within its own class.

### Components

The UI part of the application using simple SCSS, MobX and React.

It interfaces with the game using the `ObservableGame` in order to avoid too many rerenderings and an event listener overflow.

### Networking

Handles the P2P networking part.

### Game

Includes all the game logic.


## Loading resources

Resources (audio files and sprites) can be loaded by adding a corresponding class in the `resources/` directory.

The loader will automatically pick it up and load it when the game is started.

## Aseprite sprites

Please only commit the `.ase` file in the `ase/` directory and add a line to the `assets` step in the Makefile for building a `.png` file.
