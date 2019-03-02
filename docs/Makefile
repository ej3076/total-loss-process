SHELL = /bin/sh

targets = $(patsubst diagrams/%.uml, bin/%.png, $(wildcard diagrams/*.uml))
targets += $(patsubst diagrams/%.dot, bin/%.png, $(wildcard diagrams/*.dot))

.PHONY: all
all: installdirs main

.PHONY: installdirs
installdirs:
	@ mkdir -p bin

.PHONY: clean
clean:
	rm -f bin/*

main: $(targets)

bin/%.png: diagrams/%.uml
	cat $< | docker run --rm -i think/plantuml -tpng > $@

bin/%.png: diagrams/%.dot
	dot -Tpng -o $@ $<
