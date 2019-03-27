default: build lint test

ASEPRITE_FLAGS=--batch --format json-array --sheet-type verticals --all-layers
ASSETS=$(patsubst ase/%.ase,assets/%.png,$(wildcard ase/*.ase))

.PHONY: node_modules
node_modules:
	yarn

assets/%.png: ase/%.ase
	aseprite ${ASEPRITE_FLAGS} $< --data $(subst png,json,$@) --sheet $@ 

.PHONY: build
build: node_modules ${ASSETS}
	yarn run build

.PHONY: lint
lint: node_modules
	yarn lint

.PHONY: test
test: node_modules
	yarn test

.PHONY: run
run: node_modules ${ASSETS}
	yarn start
