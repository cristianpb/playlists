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

.venv/bin/spotdl:
	@uv pip install "git+https://github.com/spotDL/spotify-downloader.git@dev" 

download-data: .venv/bin/spotdl static/data
	@echo "Download data"
	@uv run download.py
