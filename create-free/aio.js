createList.aio = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 5,
    "egg": 15,
    "docker_image": "danbothosting/aio",
    "startup": "${STARTUP_CMD}",
    "limits": {
        "memory": 0,
        "swap": -1,
        "disk": 1024,
        "io": 500,
        "cpu": 0
    },
    "environment": {
        "STARTUP_CMD": "bash"
    },
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    /*"allocation": {
        "default": 1
    },*/
    "deploy": {
        "locations": [1],
        "dedicated_ip": false,
        "port_range": ["1101", "1103"],
    },
    "start_on_completion": false
})


// REVERT THIS FILE TO ORIGINAL STATE BEFORE COMMITTING
// IMPORTANT: DO NOT MERGE THIS FILE
