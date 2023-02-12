createListPrem.barotrauma = (serverName, userID) => ({
    "name": serverName,
    "user": userID,
    "nest": 4,
    "egg": 56,
    "docker_image": "quay.io/parkervcp/pterodactyl-images:ubuntu_source",
    "startup": './DedicatedServer -batchmode',
    "limits": {
        "memory": 4096,
        "swap": -1,
        "disk": 0,
        "io": 500,
        "cpu": 0
    },
    "environment": {},
    "feature_limits": {
        "databases": 2,
        "allocations": 1,
        "backups": 10
    },
    "deploy": {
        "locations": gamingPREM,
        "dedicated_ip": false,
        "port_range": []
    },
    "start_on_completion": false,
    "oom_disabled": false
})
