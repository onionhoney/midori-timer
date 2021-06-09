import React, {useState} from 'react';
import { Input, Stack, Button, Code} from "@chakra-ui/react"
import firebase from './firebase';

const sampleSession = {
    compname: "-MbeCEXTJu3raTt_GiMI",
    type: "3x3",
    solves: {
        1: {
            result: 2.81
        },
        2: "ben",
        3: "ben",
    }
};

function createSession(settings, callback) {
    // "sessions": {
    //     "session_id1": {
    //         "owner": uid,
    //         "compname": null,
    //         "type": "3x3",
    //         "tag": "roux", // is tag really necessary? might not work PARTICULARLY well with comps but idk
    //         "solves": {
    //             "solve1": {
    //                 "result": 2.81,
    //                 "penalty": "ok" | "+2" | "dnf",
    //                 "scramble": "RUF",
    //                 "date": timestamp,
    //             }
    //         }
    //     },
    /*
    settings
    - name : string, unique id of comp
    - type : event type, "2x2", "3x3", etc.
    - start , end : beginning and ending time in secs (end ignored if strict_time is false)
    - unlisted : boolean, set to true if comp is not publicly searchable. If unlisted, private link is required to access the comp.
    - scrambles : list of scrambles, comma separated
    - n_solves : number of solves, should match the length of scrambles
    */
    settings = Object.assign({}, sampleSession, settings)
    console.log(settings)
    let { compname, type, solves } = settings
    let uid = firebase.auth().currentUser.uid
    firebase.database().ref("comps").push({
        owner: uid,
        compname,
        type,
        solves,
    }, (error) => {
        callback && callback(error)
    })
}

export const SubmitTimesForm = (props) => {
    let arrayLength = 3 // TODO: Change this based on props
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [listState, setListState] = useState(new Array(arrayLength).fill(""));

    const timeFields = listState.map((currVal, i) => (
            <Input
                key={i}
                value={listState[i]}
                onChange={(e) => {setListState(Object.assign([], listState, {[i]: e.target.value}))}}
                placeholder={`Time ${i+1}`}
            />
        ))
    // Autofill scrambles from scramble generators at some point

    const handleClick = () => {
        // TODO: I feel like this needs to first create a session, then using the id of 
        // the session created, add that to the comp sessions part
        createSession({
            name,
            scrambles: listState.join(",")
        }, (error) => {
          if (error) {
            setMessage(`${error.name} : ${error.message}`)
          } else {
            setMessage(`Results submitted successfully`)
          }
        })
        console.log(listState)
    }
    return (
        <Stack>
            {/* <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
            /> */}
            {timeFields} 
            <Button colorScheme="teal" variant="solid" onClick={handleClick}>
                Submit
            </Button>
            <Code>
                {message}
            </Code>
        </Stack>
    )
}