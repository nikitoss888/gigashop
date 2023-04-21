// import React from 'react';
// import logo from './logo.png';
import styled from '@emotion/styled';

const color = 'white'

let MyDiv = styled.div({
    padding: 32,
    backgroundColor: 'red',
    fontSize: 24,
    borderRadius: 5,

    '&:hover': {
        backgroundColor: color,
    }
});

function App() {
  return (
      <MyDiv>
        Hover to change color.
      </MyDiv>
  );
}

export default App;
