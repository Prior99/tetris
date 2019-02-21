default: build lint test

.PHONY: node_modules
node_modules:
	yarn

.PHONY: assets
assets:
	mkdir assets || true
	aseprite -b ase/tetriminos.ase --sheet-type verticals --all-layers --data assets/tetriminos.json --sheet assets/tetriminos.png

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
