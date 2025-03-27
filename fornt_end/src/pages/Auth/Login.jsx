import React from 'react';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';

function Login() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Button variant="contained" color="primary">
        Hello MUI
      </Button>
      <Container>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat at, repellendus aspernatur velit inventore, architecto quos aliquid sunt hic iusto, perferendis earum odit sit. Animi est nemo facere, fuga ad cum quia natus odio cupiditate temporibus laboriosam velit neque! Eveniet, quas placeat corporis at vero ex perspiciatis nulla sequi, eaque delectus officia minima, iure ad!</Container>
    </div>
  );
}

export default Login;