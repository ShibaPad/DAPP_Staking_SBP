import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import shiba from '../assets/shiba.png';
import Store from '../store/store';
import Input from './Input';
import { Text, Row } from './style';
import { useObserver } from 'mobx-react';
import { useAlert } from 'react-alert';

const stakeable = (allownce, stakeAmount) => {
  return Number(allownce) >= Number(stakeAmount);
};
const StakingBox = () => {
  const alert = useAlert();
  const [stakingInfo, setStakingInfo] = useState({});
  const [stakingAmount, setStakingAmount] = useState('');
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (
      (stakingInfo.storageId &&
        stakingAmount &&
        Store.account &&
        Number(stakingInfo.minAmount) <= Number(stakingAmount) &&
        Number(stakingAmount) <= Number(Store.stakingInfo.SBPBalance)) ||
      !stakeable(Store.stakingInfo.allowance, stakingAmount)
    )
      setDisable(false);
    else setDisable(true);
  }, [
    Store.stakingInfo.SBPBalance,
    Store.account,
    Store.stakingInfo.allowance,
    stakingAmount,
    stakingInfo,
  ]);

  const handleSelect = info => setStakingInfo(info);

  const handleAmount = e => {
    const { value } = e.target;
    if (value && value > 0) setStakingAmount(value);
    if (!value) setStakingAmount('');
  };

  const handleStake = async () => {
    if (stakeable(Store.stakingInfo.allowance, stakingAmount)) {
      Store.getSBPBalance().then(async res => {
        if (
          res &&
          Store.account &&
          stakingAmount > 0 &&
          Number(stakingAmount) <= Number(Store.stakingInfo.SBPBalance)
        ) {
          await Store.stakeSBP({
            amount: stakingAmount,
            storageId: stakingInfo.storageId,
          }).then(res => {
            if (res) console.log('box', res);
            if (res.result) {
              // success
              alert.show(res.msg, { type: 'success' });
              Store.fetchAccountInfo();
              // TVL, staking balance, total Expected Reward, tier, sbp balance, stakingList
            } else {
              // fail
              alert.show(res.msg, { type: 'error' });
            }
          });
        } else {
          //balance err 표시
        }
      });
    } else {
      Store.ApproveMaxBalance().then(res => {
        if (res.result) {
          alert.show(res.msg, { typed: 'success' });
        } else {
          alert.show(res.msg, { type: 'error' });
        }
      });
    }
  };
  return useObserver(() => {
    return (
      <StakingWrapper>
        <SelectWrapper>
          <Row>
            <Text color="#ffffff">Total Value Locked : </Text>
            <Text color="#f6c179">{Store.stakingInfo.TVL/10**18} SBP</Text>
          </Row>
          <Row>
            <Text color="#ffffff">Release Date : </Text>
          </Row>
          <SelectBoxWrapper>
            {Store.stakingPool &&
              Store.stakingPool.length > 0 &&
              Store.stakingPool.map((elem, index) => {
                return (
                  <SelectBox
                    checked={stakingInfo.storageId === elem.storageId}
                    onClick={() => handleSelect(elem)}
                  >
                    {elem.name}
                  </SelectBox>
                );
              })}
          </SelectBoxWrapper>
          <Row>
            <Text color="#ffffff">Reward rate for </Text>
            <Text color="#66ac5b">
              {stakingInfo.name ? `${stakingInfo.name} : ` : null}
            </Text>
            <Text color="#f6c179">
              {stakingInfo.rewardPercentage
                ? `${stakingInfo.rewardPercentage}%`
                : null}
            </Text>
          </Row>
          <Row>
            <Text color="#ffffff">Minimum Amount to Stake: </Text>
            <Text color="#f6c179">
              {stakingInfo.minAmount ? `${stakingInfo.minAmount/10**18} SBP` : null}
            </Text>
          </Row>
        </SelectWrapper>
        <StakingInfoWrapper>
          <FlexDiv>
            <StakingInfo>
              <Row>
                <Text color="#d5ccc8" width="10rem">
                  Your SBPs in Staking :{' '}
                </Text>
                <Text color="#f6c179">
                  {Store.stakingInfo.accountStakingTotal/10**18} SBP{' '}
                </Text>
              </Row>
              <Row>
                <Text color="#d5ccc8" width="10rem">
                  TotalEstimatedRewards :{' '}
                </Text>
                <Text color="#f6c179">
                  {Store.stakingInfo.totalExpectedReward/10**18} SBP{' '}
                </Text>
              </Row>
              <Row>
                <Text color="#d5ccc8" width="10rem">
                  Account Tier :
                </Text>
                <Text color="#f6c179"> {Store.stakingInfo.tier} </Text>
              </Row>
              <Row>
                <Text color="#d5ccc8" width="10rem">
                  Account SBP Balance :{' '}
                </Text>
                <Text color="#f6c179">{Store.stakingInfo.SBPBalance/10**18} SBP </Text>
              </Row>
            </StakingInfo>
            <Logo src={shiba} />
          </FlexDiv>
          <Input
            style={{ marginTop: '1rem' }}
            onChange={handleAmount}
            value={stakingAmount}
          />
          <Text color="#f6c179" width="36rem">
          Staking entrance fee : 16% / This will be compensated at the claim
          </Text>
          <FlexDiv>
            <StakeButton onClick={handleStake} disabled={disable}>
              {stakeable(Store.stakingInfo.allowance, stakingAmount)
                ? 'StakeSBP'
                : 'ApproveSBP'}
            </StakeButton>
          </FlexDiv>
        </StakingInfoWrapper>
      </StakingWrapper>
    );
  });
};

export default StakingBox;

const StakingWrapper = styled.div`
  border-radius: 1rem;
  border: solid 0.13rem #f6c179;
  margin: 0 1rem 0 1rem;
  background-color: #594139;
`;
const SelectWrapper = styled.div`
  background-color: #74564a;
  border-radius: 0.85rem 0.85rem 0 0;
  padding: 1rem;
`;
const SelectBoxWrapper = styled.div`
  padding: 0.5rem;
  display: flex;
  flex: 1 1 0;
`;
const SelectBox = styled.button`
  border-radius: 0.25rem;
  border: ${props => (props.checked ? 'solid 2px #fff' : 'none')};
  /* margin: 0.1rem 0.5rem 0.1rem 0.5rem; */
  margin: auto 0.1rem auto 0.1rem;
  color: ${props => (props.checked ? '#fff' : '#74564a')};
  background-color: ${props => (props.checked ? '#66ac5b' : '#d5ccc8')};
  &:hover {
    background-color: #66ac5b;
    color: '#74564a';
  }
  font-family: Teko;
  font-size: 1.3rem;
  transition: background-color 0.25s ease-out 100ms;
`;
const StakingInfoWrapper = styled.div`
  padding: 1rem;
  border-radius: 0 0 0.85rem 0.85rem;
  background-color: #594139;
  /* display: flex; */
`;

const StakingInfo = styled.div`
  flex: auto;
  min-width: 11rem;
`;
const Logo = styled.img`
  width: 8rem;
  @media (max-width: 500px) {
    width: 6rem;
  }
  @media (max-width: 360px) {
    width: 4rem;
  }
  object-fit: contain;

  margin: 0 0 0 1rem;
`;

const FlexDiv = styled.div`
  display: flex;
`;

const StakeButton = styled.button`
  width: 7rem;
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
  margin: 1rem auto 0 auto;
  ${props => {
    if (props.disabled) {
      return 'border: solid 2px #757575; background-color: #74564a; color: #757575';
    }
  }}
`;
