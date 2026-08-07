<script>
  import * as Plot from '@observablehq/plot';
  import Graph from 'graphology';
  import circular from 'graphology-layout/circular';
  import forceAtlas2 from 'graphology-layout-forceatlas2';

  let { rawData, playlistSelection, topArtistsPerPlaylist = 6 } = $props();

  let div = $state();
  let w = $state();

  $effect(() => {
    div?.firstChild?.remove();
    div?.append(doGraphPlot());
  });

  const artistsList = (artists) => (typeof artists === 'string') ? [artists] : artists;

  const buildGraph = (data, playlists, topN) => {
    const graph = new Graph({ type: 'undirected', multi: false, allowSelfLoops: false });

    playlists.forEach(playlist => {
      const songsInPlaylist = data.filter(song => song.playlist === playlist);
      const uniqueSongs = songsInPlaylist
        .filter((value, index) => songsInPlaylist.map(s => s.song_id).indexOf(value.song_id) === index);

      if (uniqueSongs.length === 0) return;

      const artistCounts = {};
      uniqueSongs.forEach(song => {
        artistsList(song.artists).forEach(artist => {
          artistCounts[artist] = (artistCounts[artist] || 0) + 1;
        });
      });

      const topArtists = Object.entries(artistCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN);

      graph.mergeNode(playlist, { type: 'playlist', label: playlist });

      topArtists.forEach(([artist, count]) => {
        graph.mergeNode(artist, { type: 'artist', label: artist });
        graph.mergeEdge(artist, playlist, { weight: count });
      });
    });

    return graph;
  };

  const pruneSingleLinkArtists = (graph) => {
    const soloArtists = graph.filterNodes((node, attrs) =>
      attrs.type === 'artist' && graph.degree(node) === 1
    );
    soloArtists.forEach(node => graph.dropNode(node));
    return graph;
  };

  const pruneIsolatedPlaylists = (graph) => {
    const isolatedPlaylists = graph.filterNodes((node, attrs) =>
      attrs.type === 'playlist' && graph.degree(node) === 0
    );
    isolatedPlaylists.forEach(node => graph.dropNode(node));
    return graph;
  };

  const layoutGraph = (graph) => {
    circular.assign(graph);
    forceAtlas2.assign(graph, {
      iterations: 200,
      settings: {
        gravity: 4,
        scalingRatio: 5,
        slowDown: 5,
        adjustSizes: true,
        barnesHutOptimize: graph.order > 150,
      },
    });
    return graph;
  };

  const doGraphPlot = () => {
    const graph = layoutGraph(pruneIsolatedPlaylists(pruneSingleLinkArtists(buildGraph(rawData, playlistSelection, topArtistsPerPlaylist))));

    const nodes = graph.mapNodes((node, attrs) => ({
      id: node,
      type: attrs.type,
      label: attrs.label,
      x: attrs.x,
      y: attrs.y,
      degree: graph.degree(node),
    }));

    const edges = graph.mapEdges((edge, attrs, source, target, sourceAttrs, targetAttrs) => ({
      weight: attrs.weight,
      x1: sourceAttrs.x,
      y1: sourceAttrs.y,
      x2: targetAttrs.x,
      y2: targetAttrs.y,
    }));

    const chart = Plot.plot({
      width: w,
      height: w < 500 ? w * 0.85 : w / 2.2,
      marginTop: 8,
      marginRight: 8,
      marginBottom: 8,
      marginLeft: 8,
      x: { axis: null },
      y: { axis: null },
      r: { range: [2, 9] },
      color: {
        legend: true,
        domain: ['playlist', 'artist'],
        range: ['#ff3e00', '#40b3ff'],
      },
      marks: [
        Plot.link(edges, {
          x1: 'x1',
          y1: 'y1',
          x2: 'x2',
          y2: 'y2',
          stroke: '#999',
          strokeOpacity: 0.35,
          strokeWidth: d => Math.sqrt(d.weight),
        }),
        Plot.dot(nodes, {
          x: 'x',
          y: 'y',
          r: 'degree',
          fill: 'type',
          stroke: 'white',
          strokeWidth: 1,
          title: d => `${d.label}\n${d.type} · ${d.degree} connection${d.degree === 1 ? '' : 's'}`,
        }),
        Plot.text(nodes, {
          x: 'x',
          y: 'y',
          text: 'label',
          dy: d => d.type === 'playlist' ? -8 : 7,
          fontWeight: d => d.type === 'playlist' ? 700 : 400,
          fontSize: d => d.type === 'playlist' ? 9 : 8,
          fill: d => d.type === 'playlist' ? '#000' : '#333',
        }),
      ],
    });

    return chart;
  };
</script>

<div bind:this={div} role="img" bind:clientWidth={w}></div>
