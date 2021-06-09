import React, {useState} from 'react';
import { Input, Stack, Button, Code} from "@chakra-ui/react"
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper} from "@chakra-ui/react"
import firebase from './firebase';

const sampleComp = {
    name: "rms-weekly-216-3x3",
    type: "3x3",
    start: new Date("2021-01-01T14:48:00.000+09:00").getTime(),
    end: new Date("2021-10-10T14:48:00.000+09:00").getTime(),
    unlisted: false,
    strict_time: true,
    scrambles: "",
    n_solves: 5
};

async function createComp(settings, callback, setMessage) {
    /*
    settings
    - name : string, unique id of comp
    - type : event type, "2x2", "3x3", etc.
    - start , end : beginning and ending time in secs (end ignored if strict_time is false)
    - unlisted : boolean, set to true if comp is not publicly searchable. If unlisted, private link is required to access the comp.
    - scrambles : list of scrambles, comma separated
    - n_solves : number of solves, should match the number of scrambles
    */
    settings = Object.assign({}, sampleComp, settings)
    console.log(settings)
    let { name, type, start, end, unlisted, scrambles, n_solves, strict_time } = settings
    let uid = firebase.auth().currentUser.uid
    let updates = {};
    let postKey = firebase.database().ref("comps").push().key;
    updates[`comps/${postKey}`] = {
        settings: {
            name,
            type,
            start,
            end,
            unlisted,
            strict_time,
            scrambles,
            n_solves,
            su: {
                [uid]: true
            }
        }
    }
    // if listed, add comp_id to comps_public

    // add comp to users/$uid/comp_owned
    updates[`users/${uid}/comps_owned/${postKey}`] = true
    firebase.database().ref().update(updates, callback);
    if(!unlisted) {
        firebase.database().ref(`comps_public/${postKey}`).set({name, type, start, end, strict_time, n_solves})
    }
}

const createPublicComp = (id, callback) => {
    firebase.database().ref(`comps_public/${id}`).set(true, (error) => {
        callback && callback(error)
    })
}

const defaultNSolves = 3
const maxNSolves = 10
export const CompForm = (props) => {
    const [nSolves, setNSolves] = useState(defaultNSolves)
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [listState, setListState] = useState(new Array(maxNSolves).fill(""));
    //const nSolvesNum = Number.isNaN(nSolves) ? defaultNSolves : nSolves
    const nSolvesNum = nSolves

    const scrambleFields = listState.slice(0, nSolvesNum).map((currVal, i) => (
            <Input
                key={i}
                value={listState[i]}
                onChange={(e) => {setListState(Object.assign([], listState, {[i]: e.target.value}))}}
                placeholder={`Scramble ${i+1}`}
            />
        ))
    // Autofill scrambles from scramble generators at some point

    const handleNSolveChange = (str, num) => {
        if (Number.isNaN(num)) {
            setNSolves(str)
        } else {
            num = Math.min(num, maxNSolves)
            setNSolves(num)
        }
    }
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
        }, setMessage)
        console.log(listState)
    }
    return (
        <Stack>
            <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="name"
            />
            <NumberInput value={nSolves} max={maxNSolves} clampValueOnBlur={true} onChange={handleNSolveChange}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
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