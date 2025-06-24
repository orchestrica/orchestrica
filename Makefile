# Makefile

IMAGE_NAME ?= orca-agent
TAG ?= latest
DOCKERFILE ?= packages/orca-agent/Dockerfile
CONTEXT ?= packages/orca-agent

.PHONY: build push

build:
	docker build -f $(DOCKERFILE) -t $(IMAGE_NAME):$(TAG) $(CONTEXT)

push:
	docker push $(IMAGE_NAME):$(TAG)