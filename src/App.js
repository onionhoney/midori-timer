import logo from './logo.svg';
import './App.css';

import { Center } from '@chakra-ui/react';
import Card from './Card.js';

function App() {
  return (
    <div className="App">
      <Center mt={3}>
        <Card/>
      </Center>
    </div>
  );
}

// https://chakra-ui.com/docs/features/color-mode

export default App;