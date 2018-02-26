const domain = "cocytus.xyz:8080"

const serverTemplate = {
    gameName: "N/A",
    gameVersion: "N/A",
    ip: "N/A",
    map: "N/A",
    maxPlayers: 0,
    numPlayers: 0,
    password: 0,
    port: 0,
    secure: 0,
    status: "pending",
    url: ""
};

function convertToGame(game) {
    switch (game) {
        case "Counter-Strike": return "cs";
        case "Counter-Strike: Source": return "css";
        case "Counter-Strike: Global Offensive": return "csgo"
    }
}

// create vue control
const serverControl = new Vue({
    el: "#servers",

    // initial data seed
    data: {
        servers: []
    },

    created() {
        this.servers = servers.map((url) => {
            return Object.assign({}, serverTemplate, {
                url: url,
                serverName: url
            });
        });

        this.fetchData();
    },

    methods: {
        fetchData: function () {
            this.servers.forEach((server, index) => {
                const [ip, port] = server.url.split(":");
                this.fetchServerInfo(ip, port, index);
            });
        },
        fetchServerInfo: async function (ip, port, index) {
            const url = `https://${domain}/?ip=${ip}&port=${port}`;
            const response = await fetch(url);
            const json = await response.json();
            if (json.status !== "error") {

                const serverData = Object.assign({}, serverTemplate, json, {
                    status: "available",
                    mapImage: `/images/maps/${json.map}.png`,
                    gameImage: `/images/games/${convertToGame(json.gameName)}.png`
                });

                Vue.set(this.servers, index, serverData);
            }
            else {
                const serverData = Object.assign({}, serverTemplate, this.servers[index], {
                    status: "error"
                });

                Vue.set(this.servers, index, serverData);
            }
        }
    }
});