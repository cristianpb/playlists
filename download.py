#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os
import re
import sys
import glob
import yaml
import subprocess
import pandas as pd
from yaml.loader import SafeLoader

def download(key, url):
    cmd="docker run --rm -v ${PWD}/tmpplaylists:/music  spotdl/spotify-downloader save "f"${url.strip()} --save-file {key}.spotdl"
    process=subprocess.Popen(cmd, shell=True, stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    output = process.stdout.read().decode('utf-8')
    print("OUT: "+output)

def read_data():
    df = pd.DataFrame()
    for f in glob.glob('tmpplaylists/*.spotdl'):
        df = pd.concat([df, pd.read_json(f).assign(playlist=f.split("/")[1].split(".")[0], position=lambda x: x.index + 1)], ignore_index=True)
    cols = ['name', 'artists', 'album_name', 'date', 'song_id', 'cover_url', 'playlist', 'position']
    df[cols].to_csv('data/data.csv', index=False, header=True)

with open('playlists.yaml', 'r') as f:
    data = list(yaml.load_all(f, Loader=SafeLoader))[0]
    for key, url in data.items():
        download(key,url)
read_data()
