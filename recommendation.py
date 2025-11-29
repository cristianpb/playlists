import os
import subprocess
import pandas as pd

notification_url = os.getenv('NOTIFICATION_URL', '')

def notify_telegram(songs):
    for song in songs:
        cmd = (
            "docker run --rm containrrr/shoutrrr send " 
            f"--url {notification_url} "
            f"--message {song}"
        ).split(" ")
        p = subprocess.Popen(
            cmd, stderr=subprocess.STDOUT, stdout=subprocess.PIPE
        )
        for line in iter(p.stdout.readline, b""):
            print(f">>> {line.rstrip().decode('utf-8')}")


if __name__ == "__main__": 
    df = pd.read_parquet('./static/data/historical.parquet')
    commit_date = df['commit_date'].max()
    last_week = commit_date - pd.Timedelta(9, unit='D')

    # identify non changing playlists
    mean_songs_playlist = df.groupby(['playlist', 'commit_date']).agg({'song_id': 'nunique'}).reset_index().groupby('playlist').agg({'song_id': 'mean'})

    # playlists with less than 2 different songs over time
    non_changing_playlists = (
        df
        .groupby('playlist').agg({'song_id': 'nunique'})
        .merge(mean_songs_playlist.rename({'song_id': 'number_of_songs'}, axis="columns"), how='left', left_index=True, right_index=True)
        .assign(
            same_songs=lambda x: x['song_id'] / x['number_of_songs']
        )
        .sort_values(by='same_songs')
        .query('same_songs < 2')
        .index.tolist()
    )

    # artists already known
    artists_in_playlists = (
        df.query('playlist in @non_changing_playlists')
        .explode('artists')
        .groupby('artists')
        .agg({'playlist': 'unique'})
        .rename({'playlist': 'seen in'}, axis="columns")
    )

    # last commit songs in new playlist
    songs = (
        df.query('commit_date == @commit_date and playlist not in @non_changing_playlists and date > @last_week.tz_localize(None)')
        .explode('artists')
        .merge(artists_in_playlists, how='left', left_on='artists', right_index=True)
        .dropna(subset=['seen in'])
        #.query('`seen in`.str.len() > 1')
        .groupby('song_id')
        .agg({
            'artists': lambda x: ", ".join(x.unique().tolist()),
            'position': 'min',
            'name': 'unique', 'album_name': 'unique', 
            'date': lambda x: x.dt.strftime('%d/%m/%Y').unique().tolist(), 
            'cover_url': 'unique',
            'playlist': 'unique', 'seen in': lambda x: ", ".join(x.explode().unique().tolist())}
         )
        .query('~artists.str.contains("Double P|Peso Pluma|Carín León", case=False, na=False)')
        .query('playlist.str.len() > 1')
        .assign(
            url= lambda x: "https://open.spotify.com/track/" + x.index.astype(str)
        )
        .sample(1)
        ['url'].tolist()
    )
    notify_telegram(songs)
