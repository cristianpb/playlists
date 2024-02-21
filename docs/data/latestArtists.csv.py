import pandas as pd
import sys
import datetime

today = datetime.date.today()
last_month = today - datetime.timedelta(days=30)

### TO REPLACE
df = pd.read_pickle("docs/data/historical.pkl")
###

playlist_choosen = ['JazzintheBackground', 'NewMusicFriday',
                    'FreshFinds', 'DeepSleep']

(
    df
    .query('date > @last_month')
    .query('position < 30')
    .query('playlist not in @playlist_choosen')
    .assign(artists = lambda x:  x['artists'].str.join(', '),
            commit_date = lambda x: pd.to_datetime(x['commit_date']).dt.strftime("%Y-%m-%d")
            )
    .to_csv(sys.stdout, index=False)
)
