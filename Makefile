default: build lint test

ASEPRITE_FLAGS=--batch --format json-array --sheet-type verticals --all-layers 

.PHONY: node_modules
node_modules:
	yarn

.PHONY: assets
assets:
	mkdir assets || true
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-i.ase --data assets/tetrimino-i.json --sheet assets/tetrimino-i.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-j.ase --data assets/tetrimino-j.json --sheet assets/tetrimino-j.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-l.ase --data assets/tetrimino-l.json --sheet assets/tetrimino-l.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-o.ase --data assets/tetrimino-o.json --sheet assets/tetrimino-o.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-s.ase --data assets/tetrimino-s.json --sheet assets/tetrimino-s.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-t.ase --data assets/tetrimino-t.json --sheet assets/tetrimino-t.png
	aseprite ${ASEPRITE_FLAGS} ase/tetrimino-z.ase --data assets/tetrimino-z.json --sheet assets/tetrimino-z.png

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
