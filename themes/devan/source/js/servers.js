

new Vue({
    el: "#servers",
    data: {
        servers: [
            { url: "test" }
        ]
    },
    created() {
        this.servers = servers.map((url) => {
            return { url: url };
        });

        this.servers.map((server, index) => {
            const [ip, port] = server.url.split(":");
            const url = `http://cocytus.xyz:8080/?ip=${ip}&port=${port}`;
            fetch(url).then((response) => {
                response.json().then((json) => {
                    console.log(json);
                    this.servers[index] = Object.assign({}, { url: this.servers[index].url }, json);
                });
            });
        });

    }
});