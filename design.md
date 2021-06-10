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

## Pages

### Comp Management
- CompAdminBrowsingView(for showing all comps user has created)
- CompAdminEditingView(for creating or editing a comp, and managing all the results)

### Comp Participation
- CompBrowsingView (for browsing thru listed comps, and accessing unlisted comps by id, can double as a page to show all comps user have joined)
- CompSubmissionView (submitting to a comp found through CompBrowingView, can double as a ReviewMySubmissionView by making all the fields read-only)

### Timer

- CurrentTimeView
- ScramblerView
- DrawScrambleView

- CurrentSessionTableView (parent view that includes session switching button + resultsTableView or MoAoView)
	- ResultsTableView
	- ResultsStatsView 
	- MoAoResultsTableView
	- MoAoResultsStatsView 

- SessionManagementView (for showing all sessions, and session syncing)

- MidoriTimerView (top level view that integrates everything)


## Database schema
```JS
{
    "users": {
        "user_id1": {
            "name": "Antonio Kam Ho Tung",
            "email": "ben@gmail.com",
            "wcaid": "",
            "sessions": {
                "session_id1": true,
                "session_id2": true,
            },
            "comps_owned": {
                "random_comp_id1": true
            },
            "comps_joined": {
                "random_comp_id1": true,
            }
        }
    },
    "comps_public": {
        "random_comp_id1": true
    },
    "comps": {
        "random_comp_id1": {
            "settings": {
                "name": "rms-weekly-216-3x3",
                "su": {
                    "user_id_1": true,
                },
                "scramble": "RUF,RB2L",
                "type": "3x3",
                "unlisted": false,
                "strict_time": false,
                "start": 123,
                "end": 234,
            },
            "submissions": {
                "session_idx": true,
                "session_idy": true,
            },
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
                    "penalty": "ok" | "+2" | "dnf",
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
                    "penalty": "ok" | "+2" | "dnf",
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
{
	"rules": {
    "users": {
        "$uid": {
            ".read": "auth.uid == $uid",
            ".write": "auth.uid == $uid",
            ".validate": "newData.hasChildren(['name', 'email', 'wcaid', 'sessions', 'comps_owned', 'comps_joined'])",
        }
    },
    "comps_public": {
        "$comp_id": {
            ".write": "root.child('comps').child($comp_id).child('settings').child('su').child(auth.uid).exists()",
            ".validate": "root.child('comps').child($comp_id).exists()"
        },
        ".read": true
    },
    "comps": {
        "$comp_id": {
            "settings": {
                ".write": "newData.child('su').child(auth.uid).exists()",
                ".validate": "newData.hasChildren(['name', 'type', 'unlisted', 'strict_time', 'start', 'end', 'scrambles', 'su', 'n_solves' ])",
            },
            "submissions": {
                "$session_id": {
                    ".write": "root.child('sessions').child($session_id).child('uid').val() == auth.uid" // must only upload session from self
                }
            },
            ".read": true,
            ".write": true //".write": "root.child('comps').child($comp_id).child('su').child(auth.uid).exists()"
        },
    },
    "comp_results": {
        // TODO: limit # of submissions per user
        "$comp_id": {
        }
    },
    "sessions": {
        "$session_id": {
            "solves": {
                ".validate": true,
                // COMMENT: performance issues??
                "$solve_id": {
                    ".validate": "newData.hasChildren(['result', 'penalty', 'scramble', 'date'])"
                }
            },
            ".read": "data.child('owner').val() == auth.uid",
            ".write": "data.child('owner').val() == auth.uid",
            ".validate": "newData.hasChildren(['uid', 'compname', 'type', 'tags'])",
        }
    }
}
}

```
Useful link:
https://gist.github.com/codediodeio/6dbce1305b9556c2136492522e2100f6

https://firebase.google.com/docs/reference/security/database#haschildchildpath

## Methods


### create_comp(desc)
- desc: a description of comp
    - name : string, unique id of comp
    - type : event type, "2x2", "3x3", etc.
    - start , end : beginning and ending time (end ignored if strict_time is false)
    - unlisted : boolean, set to true if comp is not publicly searchable. If unlisted, private link is required to access the comp.
    - scrambles : list of scrambles, comma separated
    - n_solves : number of solves, should match the length of scrambles

User will be assigned as comp admin.

### submit_result(comp_id, session_id)

Session id must be owned by the user.

### pull_sessions(mode)
- mode: one of "default", "forced"
    
Download latest from server. Overwrite local if newer. Otherwise reject unless mode is "forced".

### push_sessions(mode)
- mode: one of "default", "forced"

Upload session to server. Overwrite server if newer. Otherwise reject, unless mode is "forced".

Here's how to perform server sync: pull all sessions from server. Merge with local sessions. (Just do a merge using timestamp as id ). Then push to server. Server will check if new updates is a strict superset, and if so, accept.  
- If sync fails, we will revert to previous state?

