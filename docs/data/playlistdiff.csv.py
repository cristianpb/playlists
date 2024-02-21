import pandas as pd
import sys

### TO REPLACE
df = pd.read_pickle("docs/data/historical.pkl")
###

last_commits = df['commit_date'].unique().tolist()[0:2]

(
    df
    .query('commit_date in @last_commits')
    .assign(artists = lambda x: x['artists'].str.join(', '))
    .get(['commit_date', 'song_id', 'artists', 'position', 'playlist', 'name', 'album_name'])
    .to_csv(sys.stdout)
)
