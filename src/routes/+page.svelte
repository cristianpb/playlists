<script>
	import { onMount } from 'svelte';
	import { fetchHistory, loadCsv } from '../components/tools/getData';
	import { data, oldData } from '../components/tools/stores';
	import Table from '../components/views/Table.svelte';
  import { dev } from '$app/environment';

	onMount(async () => {
    if (dev) {
      $data = {commitDate: new Date(), data: await loadCsv('playlists/data/data.csv')};
      $oldData = {commitDate: new Date(), data: await loadCsv('playlists/data/dataOld.csv')};
    } else {
      $data = await fetchHistory(0);
      $oldData = await fetchHistory(1);
    }
	});
</script>

<svelte:head>
	<title>Playlists</title>
	<meta name="description" content="Playlists app" />
</svelte:head>

<div class="app">
	<Table />
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
