SHELL := /bin/bash

dummy		    := $(shell touch .env)
include ./.env

encrypt:
	@gpg --symmetric --quiet --batch --yes --cipher-algo AES256 --passphrase ${GPG_SECRET_PASSPHRASE} --quiet playlists.yaml

decrypt:
	@bash decrypt_secret.sh

data:
	@echo "Creating data folder"
	@mkdir -p data

tmpplaylists:
	@echo "Creating tmp folder"
	@mkdir -p tmpplaylists

download-data: tmpplaylists data
	@echo "Download data"
	@python download.py

clean:
	@echo "cleaning tmp folder"
	@rm -rf tmpplaylists
