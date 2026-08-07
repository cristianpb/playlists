<script>

  import { base } from '$app/paths';
	import { onMount } from 'svelte';
  import RecentSongsPlot from "../components/views/RecentSongs.svelte";
  import TableRows from "../components/views/TableRows.svelte";
  import BestArtists from "../components/views/BestArtists.svelte";
  import SongsArtist from "../components/views/SongsArtist.svelte";
  import { asyncBufferFromUrl, parquetRead } from 'hyparquet';

  let latestSongs = [];
  let diffData = [];
  let last_commits = [];
  let mostFrequentArtists = [];
  let songsNames = [];
  let rawData = [];
  const playlistSelection = ['AllOut2000s', 'BigOnTheInternet', 'CafeCroissant',
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
  let playlistChoosen = playlistSelection[0];
  let artistChoosen

  $: dataFiltered = dataPrep(rawData, playlistChoosen)
  $: songsNames = dataFiltered.filter(i => artistsInMostFrequent(i.artists, [artistChoosen]))

  const artistsInMostFrequent = (artists, artistsList) => {
    if (typeof artists === 'string') {
      return artistsList.indexOf(artists) > -1
    } else {
      return artists.filter(artist =>  artistsList.indexOf(artist) > -1).length > 0
    }
  }

  const dataPrep = (data, playlistChoosen) => {

    const artistsNames = data
      .filter(song => (song.playlist == playlistChoosen)) 
      .map(song => song.artists)
      .flat()

    mostFrequentArtists = findMostFrequent(artistsNames, 7)
    console.log("mostFrequentArtists", mostFrequentArtists);

    artistChoosen = mostFrequentArtists[0]

    const bestArtists = data
      .filter(song => (song.playlist == playlistChoosen) && (artistsInMostFrequent(song.artists, mostFrequentArtists)))

    console.log("bestArtists", bestArtists.length);

    return bestArtists
  }

  const findMostFrequent = (arr, n) => {
    const counts = {};
    for (const item of arr) {
      counts[item] = (counts[item] || 0) + 1;
    }

    return Object
      .entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n).map(([value]) => value);
  }

  const fetchFileAsBuffer = async (url) => {
    try {
      // Fetch the file using the GET request
      const response = await fetch(url);

      // Check if the response is okay
      if (!response.ok) {
        throw new Error('Failed to fetch the file');
      }

      // Convert the response body to a buffer (ArrayBuffer)
      const buffer = await response.arrayBuffer();

      console.log('File fetched and saved as buffer:', buffer);

      return buffer; // Return the buffer
    } catch (error) {
      console.error('Error fetching the file:', error);
    }
  }

	onMount(async () => {
    const url = `${base}/data/historical.parquet`;
    const getLatestSongs = (mydata) => {
      const data = mydata
      rawData = data;

      last_commits = [...new Set(data.map(x => x.commit_date.toISOString().split('T')[0]))].slice(0,2);
      console.log("last_commits", last_commits);

      const excludePlaylist = ['JazzintheBackground', 'NewMusicFriday',
                    'FreshFinds', 'DeepSleep']
      // TODO add dynamic date for date filter
      latestSongs = data
        .filter(song => (song.position < 30) &&  !(excludePlaylist.indexOf(song.playlist) > -1) && (song.date > new Date().setDate(new Date(last_commits[0]).getDate()-30)))
        .map(song => {
          song.commit_date = song.commit_date.toISOString().split('T')[0]
          song.position = Number(song.position)
          return song
        })
      console.log("data preprop latestSongs", latestSongs.length);


      diffData = data
        .filter(song => (playlistSelection.indexOf(song.playlist) > -1) && (last_commits.indexOf(song.commit_date > -1)))
        .map(song => {
          song.commit_date = (typeof song.commit_date === 'string') ? song.commit_date : song.commit_date.toISOString().split('T')[0]
          song.position = Number(song.position)
          return song
        })
      console.log("diffData", diffData.length);
    }

    await parquetRead({
      file: await fetchFileAsBuffer(url),
      columns: ['name', 'artists', 'album_name', 'date', 'song_id', 'cover_url', 'playlist', 'position', 'commit_date'],
      rowFormat: 'object',
      onComplete: data => getLatestSongs(data)
    })
	});
</script>

<svelte:head>
	<title>Playlists</title>
	<meta name="description" content="Playlists app" />
</svelte:head>

<div class="app">

  {#if latestSongs.length > 0}
    <section class="card">
      <h2 class="card-title">Recent songs</h2>
      <RecentSongsPlot {latestSongs} />
    </section>
  {/if}

  <section class="card">
    <h2 class="card-title">Playlist</h2>

    {#if playlistSelection.length > 0}
      <div class="field">
        <label class="field-label" for="playlist-select">Choose a playlist</label>
        <select id="playlist-select" class="styled-select" bind:value={playlistChoosen} >
          {#each playlistSelection as playlist}
            <option value={playlist}>
            {playlist}
            </option>
          {/each}
        </select>
      </div>
    {/if}

    {#if diffData.length > 0}
      <div class="subsection">
        <TableRows bind:diffData = {diffData} bind:playlistChoosen = {playlistChoosen} bind:last_commits = {last_commits} />
      </div>
    {/if}
  </section>

  {#if dataFiltered.length > 0 && mostFrequentArtists.length > 0}
    <section class="card">
      <h2 class="card-title">Best artists</h2>
      <BestArtists bind:dataFiltered = {dataFiltered} bind:playlistChoosen = {playlistChoosen} bind:mostFrequentArtists = {mostFrequentArtists} />
    </section>
  {/if}

  {#if mostFrequentArtists.length > 0}
    <section class="card">
      <h2 class="card-title">Songs by artist</h2>
      <div class="field">
        <label class="field-label" for="artist-select">Choose an artist</label>
        <select id="artist-select" class="styled-select" bind:value={artistChoosen} >
          {#each mostFrequentArtists as artistsName}
            <option value={artistsName}>
            {artistsName}
            </option>
          {/each}
        </select>
      </div>

      {#if songsNames.length > 0}
        <div class="subsection">
          <SongsArtist bind:songsNames = {songsNames} bind:artistChoosen = {artistChoosen} bind:playlistChoosen = {playlistChoosen} />
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
  }

  .card {
    background: var(--color-bg-2);
    border-radius: 12px;
    padding: 1.25rem 1.5rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .card-title {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text);
    border-bottom: 2px solid var(--color-theme-1);
    padding-bottom: 0.4rem;
    display: inline-block;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    max-width: 20rem;
  }

  .field-label {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text);
    opacity: 0.7;
  }

  .styled-select {
    appearance: none;
    -webkit-appearance: none;
    padding: 0.55rem 2.2rem 0.55rem 0.9rem;
    font-size: 0.95rem;
    color: var(--color-text);
    background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23ff3e00'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.9rem center;
    border: 1px solid var(--color-bg-0);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .styled-select:hover {
    border-color: var(--color-theme-2);
  }

  .styled-select:focus {
    outline: none;
    border-color: var(--color-theme-1);
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.15);
  }

  .subsection {
    margin-top: 1.25rem;
  }

  @media (min-width: 480px) {
    .card {
      padding: 1.5rem 2rem 2rem;
    }
  }
</style>
