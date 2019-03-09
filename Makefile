default: build lint test

ASEPRITE_FLAGS=--batch --format json-array --sheet-type verticals --all-layers

.PHONY: node_modules
node_modules:
	yarn

.PHONY: assets
assets:
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-i.ase --data assets/tetrimino-i.json --sheet assets/tetrimino-i.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-j.ase --data assets/tetrimino-j.json --sheet assets/tetrimino-j.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-l.ase --data assets/tetrimino-l.json --sheet assets/tetrimino-l.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-o.ase --data assets/tetrimino-o.json --sheet assets/tetrimino-o.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-s.ase --data assets/tetrimino-s.json --sheet assets/tetrimino-s.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-t.ase --data assets/tetrimino-t.json --sheet assets/tetrimino-t.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-z.ase --data assets/tetrimino-z.json --sheet assets/tetrimino-z.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-other.ase --data assets/tetrimino-other.json --sheet assets/tetrimino-other.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-ghost.ase --data assets/tetrimino-ghost.json --sheet assets/tetrimino-ghost.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-light.ase --data assets/tetrimino-light.json --sheet assets/tetrimino-light.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-wood.ase --data assets/floor-wood.json --sheet assets/floor-wood.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-white-tiles.ase --data assets/floor-white-tiles.json --sheet assets/floor-white-tiles.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-tetris.ase --data assets/floor-tetris.json --sheet assets/floor-tetris.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-stars.ase --data assets/floor-stars.json --sheet assets/floor-stars.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-night-sky.ase --data assets/floor-night-sky.json --sheet assets/floor-night-sky.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-love.ase --data assets/floor-love.json --sheet assets/floor-love.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-bricks.ase --data assets/floor-bricks.json --sheet assets/floor-bricks.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-carpet.ase --data assets/floor-carpet.json --sheet assets/floor-carpet.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-hexagons.ase --data assets/floor-hexagons.json --sheet assets/floor-hexagons.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-stars.ase --data assets/floor-stars.json --sheet assets/floor-stars.png
	aseprite ${ASEPRITE_FLAGS} ase/floor-city.ase --data assets/floor-city.json --sheet assets/floor-city.png
	aseprite ${ASEPRITE_FLAGS} ase/effect-line-cleared.ase --data assets/effect-line-cleared.json --sheet assets/effect-line-cleared.png
	aseprite ${ASEPRITE_FLAGS} ase/incoming-alert.ase --data assets/incoming-alert.json --sheet assets/incoming-alert.png
	aseprite ${ASEPRITE_FLAGS} ase/score-double.ase --data assets/score-double.json --sheet assets/score-double.png
	aseprite ${ASEPRITE_FLAGS} ase/score-triple.ase --data assets/score-triple.json --sheet assets/score-triple.png
	aseprite ${ASEPRITE_FLAGS} ase/score-tetris.ase --data assets/score-tetris.json --sheet assets/score-tetris.png
	aseprite ${ASEPRITE_FLAGS} ase/combo.ase --data assets/combo.json --sheet assets/combo.png
	aseprite ${ASEPRITE_FLAGS} ase/combo-1.ase --data assets/combo-1.json --sheet assets/combo-1.png
	aseprite ${ASEPRITE_FLAGS} ase/combo-2.ase --data assets/combo-2.json --sheet assets/combo-2.png
	aseprite ${ASEPRITE_FLAGS} ase/combo-3.ase --data assets/combo-3.json --sheet assets/combo-3.png
	aseprite ${ASEPRITE_FLAGS} ase/combo-4.ase --data assets/combo-4.json --sheet assets/combo-4.png
	aseprite ${ASEPRITE_FLAGS} ase/combo-5.ase --data assets/combo-5.json --sheet assets/combo-5.png
	aseprite ${ASEPRITE_FLAGS} ase/combo-6.ase --data assets/combo-6.json --sheet assets/combo-6.png

.PHONY: build
build: node_modules assets
	yarn run build

.PHONY: lint
lint: node_modules
	yarn lint

.PHONY: test
test: node_modules
	yarn test

.PHONY: run
run: node_modules assets
	yarn start
