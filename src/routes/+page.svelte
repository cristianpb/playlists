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

    const response = await fetch(url, {
      method: 'HEAD',
    })
    await parquetRead({
      file: await asyncBufferFromUrl({url, byteLength: response.headers.get('Content-Length')}),
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
    <RecentSongsPlot {latestSongs} />
  {/if}
  <br>
  <br>
  {#if playlistSelection.length > 0}
    <select bind:value={playlistChoosen} >
      {#each playlistSelection as playlist}
        <option value={playlist}>
        {playlist}
        </option>
      {/each}
    </select>
  {/if}
  <br>
  {#if diffData.length > 0}
    <TableRows bind:diffData = {diffData} bind:playlistChoosen = {playlistChoosen} bind:last_commits = {last_commits} />
  {/if}
  <br>
  {#if dataFiltered.length > 0 && mostFrequentArtists.length > 0}
    <BestArtists bind:dataFiltered = {dataFiltered} bind:playlistChoosen = {playlistChoosen} bind:mostFrequentArtists = {mostFrequentArtists} />
  {/if}
  <br>
  <br>
  {#if mostFrequentArtists.length > 0}
    <select bind:value={artistChoosen} >
      {#each mostFrequentArtists as artistsName}
        <option value={artistsName}>
        {artistsName}
        </option>
      {/each}
    </select>
  {/if}
  <br>
  {#if songsNames.length > 0}
    <SongsArtist bind:songsNames = {songsNames} bind:artistChoosen = {artistChoosen} bind:playlistChoosen = {playlistChoosen} />
  {/if}
</div>
