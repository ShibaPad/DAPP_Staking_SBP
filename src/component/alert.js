import React from 'react';
import styled from 'styled-components';

const AlertTemplate = ({ style, options, message, close }) => (
  <AlertWrapper style={style}>
    {options.type === 'info' && '!'}
    {options.type === 'success' && ':)'}
    {options.type === 'error' && ':('}
    {message}
    <Button onClick={close}>X</Button>
  </AlertWrapper>
);

export default AlertTemplate;

const AlertWrapper = styled.div`
  background-color: red;

  font-family: Teko;
`;

const Button = styled.button``;
