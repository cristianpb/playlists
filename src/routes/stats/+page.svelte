<script>
	import { onMount } from 'svelte';
	import { fetchHistory, loadCsv } from '../../components/tools/getData';
	import { data, oldData } from '../../components/tools/stores';
	import Stats from '../../components/views/Stats.svelte';
  import { dev } from '$app/environment';

	onMount(async () => {
    if (dev) {
      $data = {commitDate: new Date(), data: await loadCsv('data/data.csv')};
      $oldData = {commitDate: new Date(), data: await loadCsv('data/dataOld.csv')};
    } else {
      $data = await fetchHistory(0);
      $oldData = await fetchHistory(1);
    }
	});
</script>

<svelte:head>
	<title>Stats</title>
	<meta name="description" content="Stats" />
</svelte:head>

<div class="app">
	<Stats />
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
