import logo from './logo.svg';
import './App.css';
import { CompForm } from './CompForm'
import { Center, Stack, HStack } from '@chakra-ui/react';
import Card from './Card.js';
import SignInScreen from './SignInScreen';


function App() {
  return (
    <div className="App">
      <Stack>
        <Center mt={3}>
          <HStack>
            <SignInScreen />
            <Card />
          </HStack>
        </Center>
        <Center>
          <CompForm />
        </Center>
      </Stack>
    </div>
  );
}

// https://chakra-ui.com/docs/features/color-mode

export default App;