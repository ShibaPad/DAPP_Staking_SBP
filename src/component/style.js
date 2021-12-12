import React from 'react';
import styled from 'styled-components';

export const Text = styled.span`
  font-family: 'Teko';
  font-size: 1.5rem;
  color: ${props => props.color};
  width: ${props => props.width};
  display: ${props => (props.width ? 'inline-block' : '')};
  @media (max-width: 425px) {
    font-size: 1rem;
    /* font-size: 0.7rem; */
    width: ${props => (props.width ? '7rem' : '')};
  }
`;

export const Row = styled.div`
  padding: 0.2rem;
`;
