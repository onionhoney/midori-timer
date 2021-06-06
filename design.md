# Design Doc

## Project structure 
- see reading-notes.md 
## Core Features

- Timer 
- Smart session management
    - (how to model moxao5's? maybe sessions - rounds - solves? )
- User auth and data upload
    - weekly comp
    - cloud sync

### Additional features 

- On top of weekly comp infra, it should be fairly easy to build an online racing thingy

## Database schema
```
{
    "users": {
        "user_id1": {
            "sessions": {
                "session_id1",
                "session_id2"
            }
        }
    },
    "sessions": {
        "session_id_1": {
            "type": "3x3",
            "tag": "roux",
            "solves": {
                "solve1": {
                    "result": 2.81,
                    "type": "none" | "+2" | "dnf",
                    "scramble": 
                    "date": timestamp
                }
            }
        }
    }
    "comps": {

    }
}
```

## Security Rules

