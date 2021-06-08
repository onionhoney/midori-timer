import React, {useState} from 'react';
import { Input, Stack, Button, Code} from "@chakra-ui/react"
import firebase from './firebase';

const sampleComp = {
    name: "rms-weekly-216-3x3",
    type: "3x3",
    start: new Date("2021-01-01T14:48:00.000+09:00").getTime(),
    end: new Date("2021-10-10T14:48:00.000+09:00").getTime(),
    unlisted: true,
    scrambles: "",
    n_solves: 5
};
function createComp(settings, callback) {
    /*
    settings
    - name : string, unique id of comp
    - type : event type, "2x2", "3x3", etc.
    - start , end : beginning and ending time in secs (end ignored if strict_time is false)
    - unlisted : boolean, set to true if comp is not publicly searchable. If unlisted, private link is required to access the comp.
    - scrambles : list of scrambles, comma separated
    - n_solves : number of solves, should match the length of scrambles
    */
    settings = Object.assign({}, sampleComp, settings)
    console.log(settings)
    let { name, type, start, end, unlisted, scrambles, n_solves } = settings
    let uid = firebase.auth().currentUser.uid
    firebase.database().ref("comps").push({
        name,
        type,
        start,
        end,
        unlisted,
        scrambles,
        n_solves,
        su: {
            [uid]: true
        }
    }, (error) => {
        callback && callback(error)
    })
}

export const CompForm = (props) => {
    let arrayLength = 3
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [listState, setListState] = useState(new Array(arrayLength).fill(""));

    const scrambleFields = listState.map((currVal, i) => (
            <Input
                key={i}
                value={listState[i]}
                onChange={(e) => {setListState(Object.assign([], listState, {[i]: e.target.value}))}}
                placeholder={`Scramble ${i+1}`}
            />
        ))
    // Autofill scrambles from scramble generators at some point

    const handleClick = () => {
        createComp({
            name,
            scrambles: listState.join(",")
        }, (error) => {
          if (error) {
            setMessage(`${error.name} : ${error.message}`)
          } else {
            setMessage(`Comp saved successfully`)
          }
        })
        console.log(listState)
    }
    return (
        <Stack>
            <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
            />
            {scrambleFields} 
            <Button colorScheme="teal" variant="solid" onClick={handleClick}>
                Submit
            </Button>
            <Code>
                {message}
            </Code>
        </Stack>
    )
}