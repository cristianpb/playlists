import requests
import pandas as pd
from io import StringIO
from ast import literal_eval

res = requests.get("https://api.github.com/repos/cristianpb/playlists/commits?sha=data")
commits = res.json()

mylist = []
limit = 20
for idx in range(len(commits)):
    if idx > limit:
        break
    print(idx, end='...')
    res = requests.get(f'https://raw.githubusercontent.com/cristianpb/playlists/{commits[idx]["sha"]}/data.csv')
    commit_date = commits[idx]["commit"]["author"]["date"]
    stringio_text = StringIO(res.text)
    df_tmp = pd.read_csv(stringio_text, sep=";")
    df_tmp = df_tmp.assign(
        commit_date=lambda x: pd.to_datetime(commit_date),
        date=lambda x: pd.to_datetime(x.date),
        artists=lambda x: x.artists.apply(literal_eval)
    )
    mylist.append(df_tmp)

df = pd.concat(mylist, ignore_index=True)
df.to_pickle('docs/data/historical.pkl')
