# Builds CSS from LESS files and
# minifies and combines javascript files

STATIC = ert/static/
LESS = lessc --clean-css
DIVIDER = @echo "========================="
YUI = yuicompressor
JSLINT = @jslint --color --white --terse
bold = `tput bold`
normal = `tput sgr0`

all: $(STATIC)ert.css

$(STATIC)ert.css: $(STATIC)ert.less
	$(DIVIDER)
	@echo "$(bold)Building stylesheet orgwolf.css...$(normal)"
	$(LESS) $(STATIC)ert.less > $(STATIC)ert.css
