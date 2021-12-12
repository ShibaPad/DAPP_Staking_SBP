import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import shibaFace from '../assets/shibaLogo.png';
import { useObserver } from 'mobx-react';
import { Text } from './style';
import Store from '../store/store';

import { useAlert } from 'react-alert';
const Header = () => {
  // Requires logout logic

  const alert = useAlert();

  const handleConnect = () => {
    Store.connectWallet().then(res => {
      if (res.result) {
        alert.show(res.msg, { type: 'success' });
        Store.addAccountListner(() => Store.fetchAccountInfo());
      } else {
        alert.show(res.msg, { type: 'error' });
      }
    });
  };
  return useObserver(() => {
    return (
      <HeaderContainer>
        <ImgWrapper>
          <Logo src={shibaFace} />
        </ImgWrapper>
        <TitleContainer>
          <Title>SHIBAPAD</Title>
          <Description>STAKING</Description>
        </TitleContainer>
        <ButtonWrapper>
          {Store.account && Store.stakingContract ? (
            <TextWrapper>
              <Text color="#d5ccc8">connected </Text>
              <Text color="#f6c179">address : </Text>
              <Text
                color="#f6c179"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={Store.account}
              >
                {Store.account}
              </Text>
            </TextWrapper>
          ) : (
            <Button onClick={handleConnect}>CONNECT</Button>
          )}
        </ButtonWrapper>
      </HeaderContainer>
    );
  });
};
export default Header;
const HeaderContainer = styled.div`
  display: flex;
  max-height: 5rem;
  padding: 0 0 3rem 0;
`;
const ImgWrapper = styled.div`
  flex: 1;
  display: flex;
  margin: 0 -1rem 0 1rem;
  width: 25%;
`;
const Logo = styled.img`
  width: 80%;
  object-fit: contain;
`;
const TitleContainer = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin: auto;
`;
const Title = styled.div`
  width: inherit;
  font-family: Teko;
  font-size: 3rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  @media (max-width: 380px) {
    font-size: 1.5rem;
  }
`;
const Description = styled.div`
  width: inherit;
  font-family: Teko;
  font-size: 2rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 3.2px;
  text-align: center;
  color: #fff;
  @media (max-width: 380px) {
    font-size: 1rem;
  }
`;
const ButtonWrapper = styled.div`
  flex: 1;
  max-width: 25%;
  display: flex;
  margin: 0 1rem 0 -1rem;
`;
const Button = styled.button`
  width: 4.8rem;
  height: 2rem;
  border-radius: 1rem;
  border: solid 2px #d5ccc8;
  background-color: #66ac5b;
  font-family: Teko;
  font-size: 1.3rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  /* line-height: 1; */
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  margin: auto;
`;
const TextWrapper = styled.div`
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
