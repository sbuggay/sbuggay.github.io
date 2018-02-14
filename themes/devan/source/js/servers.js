const data = servers.map((server) => {
    const [ip, port] = server.split(":");
    const url = `http://cocytus.xyz:8080/?ip=${ip}&port=${port}`;
    console.log(url);
    return fetch(url).then((response) => {
        console.log(response);
        return response.json();
    });

});

Promise.all(data).then((results) => {
    console.log(results);
});

const vue = new Vue({
    el: "servers",
    data: {
        servers: [
            {
                name: "test"
            },
            {
                name: "test1"
            }
        ]
    }
})