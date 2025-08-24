#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
import os
import glob
import yaml
import subprocess
import pandas as pd
from yaml.loader import SafeLoader


CWD = os.getcwd()

def download(key, url):
    cmd=f"docker run --rm -v {CWD}/tmpplaylists:/music spotdl/spotify-downloader save {url.strip()} --save-file {key}.spotdl --lyrics genius musixmatch"
    p=subprocess.Popen(cmd.split(" "),
                             stderr=subprocess.STDOUT,
                             stdout=subprocess.PIPE)
    for line in iter(p.stdout.readline, b''):
        print(f">>> {line.rstrip().decode('utf-8')}")


def read_data():
    appended_data = []
    cols = ['name', 'artists', 'album_name', 'date', 'song_id', 'cover_url', 'playlist', 'position']
    for f in glob.glob('tmpplaylists/*.spotdl'):
        data = pd.read_json(f).assign(
                artists=lambda x: x['artists'].explode().str.replace("'","").str.replace("\"", "").reset_index().groupby('index').agg({'artists': lambda y: y.tolist()}),
                playlist=f.split("/")[1].split(".")[0],
                position=lambda x: x.index + 1
                )
        assert len(set(cols).difference(data.columns)) == 0, f'Columns: {", ".join(data.columns)}'
        assert len(data) > 0, f"Shape {data.shape[0]} and {data.shape[1]} columns"
        appended_data.append(data)
    (
            pd.concat(appended_data, ignore_index=True)
            .get(cols)
            .to_csv('static/data/data.csv', index=False, header=True, sep=";")
    )


if __name__ == '__main__':
    with open('playlists.yaml', 'r') as f:
        data = list(yaml.load_all(f, Loader=SafeLoader))[0]
        for key, url in data.items():
            download(key, url)
    read_data()
