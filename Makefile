SHELL := /bin/bash

dummy		    := $(shell touch .env)
include ./.env

encrypt:
	@gpg --symmetric --quiet --batch --yes --cipher-algo AES256 --passphrase ${GPG_SECRET_PASSPHRASE} --quiet playlists.yaml

decrypt:
	@bash decrypt_secret.sh

static/data:
	@echo "Creating data folder"
	@mkdir -p static/data

tmpplaylists:
	@echo "Creating tmp folder"
	@mkdir -p tmpplaylists

download-data: tmpplaylists static/data
	@echo "Download data"
	@python3 download.py

clean:
	@echo "cleaning tmp folder"
	@rm -rf tmpplaylists
