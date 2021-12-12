import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Text } from './style';
import moment from 'moment';
import { useObserver } from 'mobx-react';
import Store from '../store/store';
const handleButtonType = mode => {
  switch (mode) {
    case 'disable':
      return 'border: solid 2px #757575; background-color: #74564a; color: #757575';
    case 'claim':
      return 'border: solid 2px #d5ccc8; background-color: #66ac5b; color: #fff;';
    case 'emergencyClaim':
      return 'border: solid 2px #eb5757; background-color: #757575; color: #eb5757;';
  }
};
// const isClaimable = date => {
//   // const nowUTC = moment().utc().format('MM/DD/YYYY HH:mm:ss');
//   // const releaseDate = date.split(' ').slice(0, -1).toString().replace(',', ' ');
//   // return new Date(nowUTC) >= new Date(releaseDate);
//   return true;
// };
const timeStampConvertor = date => {
  return moment(new Date(date * 1000))
    .utc()
    .format('MM/DD/YYYY HH:mm:ss');
};
const StakingInfoBox = ({ stakingInfo, handleClaim }) => {
  const { stakingId, amount, releaseDate } = stakingInfo;
  const [disable, setDisable] = useState(false);
  const [expectedReward, setExpectedReward] = useState('');
  useEffect(() => {
    Store.getStakeStatus(stakingId).then(res => {
      if (res) {
        if (res[2]) {
          // 미 도래 시점, emergency
          setDisable(true);
        } else {
          setDisable(false);
        }
      }
    }, []);
    Store.getExpectedPoolReward(stakingId).then(res => {
      if (res) setExpectedReward(res);
    });
  }, []);
  // needs setDisable logic

  return useObserver(() => {
    return (
      <StakingContainer>
        <StakingID>
          <Text color="#74564a">Staking ID : #{stakingId}</Text>
        </StakingID>
        <Row>
          <Text color="#fff" width="10rem">
            Staking Amount:{' '}
          </Text>
          <Text color="#f6c179">{amount/10**18} SBP</Text>
        </Row>
        <Row>
          <Text color="#fff" width="10rem">
            Estimated Reward :{' '}
          </Text>
          <Text color="#f6c179">{expectedReward/10**18} SBP  (0 for emergency claim)</Text>
        </Row>
        <Row>
          <Text color="#fff" width="10rem">
            Estimated Total SBP:{' '}
          </Text>
          <Text color="#f6c179">{amount/10**18+expectedReward/10**18} SBP</Text>
        </Row>
        <Row>
          <Text color="#fff" width="10rem">
            Release at :{' '}
          </Text>
          <Text color={disable ? '#66ac5b' : '#eb5757'}>
            {timeStampConvertor(releaseDate)} UTC
          </Text>
        </Row>
        <ButtonWrapper>
          <ClaimButton
            mode={disable ? 'claim' : 'disable'}
            disabled={!disable}
            onClick={() => handleClaim({ stakingId: stakingId, type: 'claim' })}
          >
            Claim
          </ClaimButton>
          <ClaimButton
            mode={!disable ? 'emergencyClaim' : 'disable'}
            disabled={disable}
            onClick={() =>
              handleClaim({ stakingId: stakingId, type: 'emergencyClaim' })
            }
          >
            EmergencyClaim
          </ClaimButton>
        </ButtonWrapper>
      </StakingContainer>
    );
  });
};

export default StakingInfoBox;

const StakingContainer = styled.div`
  /* height: 160px; */
  flex-grow: 0;
  border-radius: 15px;
  background-color: #74564a;
  margin: 0 1rem 1rem 1rem;
`;

const StakingID = styled.div`
  margin: 1rem 0 0;
  padding-left: 1.5rem;
  width: 10rem;
  height: 1.8rem;
  background-color: #f6c179;
  line-height: 2rem;
  @media (max-width: 425px) {
    height: 1.2rem;
    line-height: 1rem;
  }
`;

const Row = styled.div`
  padding: 0.25rem 0 0.25rem 1.5rem; ;
`;

const ButtonWrapper = styled.div`
  padding: 0.25rem 1.5rem 0.25rem 1.5rem;
  display: flex;
  justify-content: center;
`;

const ClaimButton = styled.button`
  //:disabled, claim, emergencyClaim
  font-family: Teko;
  font-size: 1rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.75;
  margin: 0.7rem;
  width: 10rem;
  height: 2rem;
  border-radius: 15px;
  border: solid 2px #d5ccc8;
  ${props => handleButtonType(props.mode)}
`;
