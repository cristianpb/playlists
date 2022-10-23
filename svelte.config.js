import adapter from "@sveltejs/adapter-static"; 

const dev = "production" === "development";

/** @type {import(""@sveltejs/kit").Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: "build",
            assets: "build"
        }),
        paths: {
            // change below to your repo name
          base: dev ? "" : "/playlists",
        }
    }
};

export default config;
