
let getPassword = () => {

    const CAPSNUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let password = "";
    while (password.length < 10) {
        password += CAPSNUM[Math.floor(Math.random() * CAPSNUM.length)];
    }
    return password;
};

createList.assettocorsa = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 54,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": './acServer',
    "limits": {
        "memory": 2048,
        "swap": -1,
        "disk": 10240,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STEAM_USER": null,
        "STEAM_PASS": null,
        "STEAM_AUTH": null,
        "HOSTNAME": "DBH hosted Assetto Corsa server.",
        "PASSWORD": null,
        "ADMIN_PASSWORD": getPassword(),
        "HTTP_PORT": "8081"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gamingFREE,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
