import { Box, Stack, Button, Input, Code, Textarea } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import firebase from "./firebase";

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

function getAuthUserInfo(user) {
  if (user == null) return "You are not logged in";
  else {
    let name = user.displayName;
    let email = user.email;
    let uid = user.uid;
    return JSON.stringify({
      name, email, uid
    }, null, 2)
  }
}
function FirebaseInput() {
  const [path, setPath] = useState("")
  const [value, setValue] = useState("")
  const [message, setMessage] = useState("")

  const [user, setUser] = useState(null); // Local signed-in state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const handleClick = () => {
    let db = firebase.database().ref(path).set(value, (error) => {
      if (error) {
        setMessage(`${error.name} : ${error.message}`)
      } else {
        setMessage(`Data on ${path} saved successfully`)
      }
    })
  }
  let info = getAuthUserInfo(user)
  return (
    <Stack>
      <Code>
        { info }
      </Code>
      <Input 
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="path"
      />
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="value"
      />
      <Button colorScheme="teal" variant="solid" onClick={handleClick}>
        Submit
      </Button>
      <Code>
        {message}
      </Code>
    </Stack>
  )
}

function Card() {
  return (
      <Box w="sm" borderWidth="1px"
          fontWeight="semibold"
          padding={5}
        >
        Midori
        <FirebaseInput/>
      </Box>
  )
}

export default Card;