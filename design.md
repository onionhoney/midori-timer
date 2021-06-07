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
```JS
{
    "users": {
        "user_id1": {
            "sessions": {
                "session_id1": true,
                "session_id2": true,
            },
            "comps": {
                "rms-weekly-216-3x3": true,
            },
        }
    },
    "comps": {
        "rms-weekly-216-3x3": {
            "sessions": {
                "session_idx": true,
                "session_idy": true,
            },
            "su": {
                "user_id_1": true,
            }
        }
    },
    "sessions": {
        "session_id1": {
            "owner": uid,
            "compname": null,
            "type": "3x3",
            "tag": "roux",
            "solves": {
                "solve1": {
                    "result": 2.81,
                    "type": "nonnull,e" | "+2" | "dnf",
                    "scramble": "RUF",
                    "date": timestamp,
                }
            }
        },
        "session_idx": {
            "owner": uid,
            "compname": "rms-weekly-216-3x3",
            "type": "3x3",
            "tag": "roux",
            "solves": {
                "solve1": {
                    "result": 2.81,
                    "type": "nonnull,e" | "+2" | "dnf",
                    "scramble": "RUF",
                    "date": timestamp,
                }
            }
        }
    }
}

```

## Security Rules

```JS
"rules": {
    "users": {
        "$user_id": {
            ".read": "auth.uid == $user_id",
            ".write": "auth.uid == $user_id",
        }
    },
    "sessions": {
        "$session_id": {
            ".read": "data.child('owner') == auth.uid",
            ".write": "data.child('owner') == auth.uid",
        }
    }
}

```

