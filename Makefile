.PHONY: default help run-container build-image
.DEFAULT_GOAL := help


help:
	@echo "Please select a target below"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

run-container: build-image ## export webaapp image installer
	@bash -c "docker run -it --rm bluesky-invite-code-finder"
build-image:  ## build container image
	@bash -c "docker build . -t bluesky-invite-code-finder"