import pandas as pd
import sys

### TO REPLACE
df = pd.read_pickle("docs/data/historical.pkl")
###

last_commits = df['commit_date'].unique().tolist()[0:2]

playlist_choosen = ['AllOut2000s', 'BigOnTheInternet', 'CafeCroissant',
                    'ColdplayRadio', 'FreshFinds', 'FutursHits', 'GardeLaPeche',
                    'GooseBumps', 'GrandHit', 'GustavoCeratiRadio',
                    'HitRadioFr', 'ItsAllGood', 'JazzintheBackground',
                    'JustHits', 'Mint', 'MorningMotivation', 'MuseRadio',
                    'NewMusicFriday', 'PopRock', 'PopRockRadio',
                    'PowerWorkout', 'ReveilDouceur', 'RockClassics',
                    'RockParty', 'RockThis', 'TheStrokesRadio',
                    'ThisIsGustavoCerati', 'TodayTopHits', 'VivaLatino',
                    'WakeUpHappy', 'Workout'
                    ]

(
    df
    .query('playlist in @playlist_choosen')
    .query('commit_date in @last_commits')
    .assign(artists = lambda x:  x['artists'].str.join(', '),
            commit_date = lambda x: pd.to_datetime(x['commit_date']).dt.strftime("%Y-%m-%d")
            )
    .get(['commit_date', 'song_id', 'artists', 'position', 'playlist', 'name', 'album_name'])
    .to_csv(sys.stdout, index=False)
)
