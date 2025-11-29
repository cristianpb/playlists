import pandas as pd
import sys

### TO REPLACE
df = pd.read_pickle("docs/data/historical.pkl")
###


last_commits = df["commit_date"].unique().tolist()[:2]


def top_artists(df_tmp):
    best_artists = df_tmp["artists"].value_counts().index.tolist()[:10]  # noqa: F841
    return df_tmp.query("artists in @best_artists")


playlist_choosen = [
    "AllOut2000s",
    "BigOnTheInternet",
    "CafeCroissant",
    "ColdplayRadio",
    "FreshFinds",
    "FutursHitsGardeLaPeche",
    "GooseBumps",
    "GrandHit",
    "GustavoCeratiRadio",
    "HitRadioFr",
    "ItsAllGood",
    "JazzintheBackground",
    "JustHits",
    "Mint",
    "MorningMotivation",
    "MuseRadio",
    "NewMusicFriday",
    "PopRock",
    "PopRockRadio",
    "PowerWorkout",
    "ReveilDouceur",
    "RockClassics",
    "RockParty",
    "RockThis",
    "TheStrokesRadio",
    "ThisIsGustavoCerati",
    "TodayTopHits",
    "VivaLatino",
    "WakeUpHappy",
    "Workout",
]

(
    df.query("playlist in @playlist_choosen")
    .explode("artists")
    .groupby("playlist")
    .apply(top_artists)
    .assign(
        commit_date=lambda x: pd.to_datetime(x["commit_date"]).dt.strftime("%Y-%m-%d")
    )
    .get(
        [
            "date",
            "commit_date",
            "song_id",
            "artists",
            "position",
            "playlist",
            "name",
            "album_name",
        ]
    )
    .to_csv(sys.stdout, index=False)
)
