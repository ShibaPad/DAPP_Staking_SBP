import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StatkingInfoBox from './StakingInfoBox';
import Header from './Header';
import StakingBox from './StakingBox';
import Store from '../store/store';
import { useObserver } from 'mobx-react';
import CustomModal from './Modal';
//  Store.stakedPools = {
//   0: "664453334", //staking amount
// 1: "1699150422", // release data
// 2: true, //isSet
// 3: false, //claimed
// 4: "9", // poolreward
// 5: "2",
// PoolRewardPercentage: "9",
// amount: "664453334",
// claimed: false,
// isSet: true,
// releaseDate: "1699150422",
// storageId: "2",
// stakingId: "1",
// }

const Main = () => {
  useEffect(() => {
    Store.fetchContract().then(res => {
      if (res) {
        Store.getStakingPool(); // storage 정보
        Store.getTVL();
        Store.getPenaltyFee();
      }
    });
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('claim');
  const [stakingId, setStakingId] = useState('');
  const handleClaim = ({ stakingId, type }) => {
    setModalVisible(true);
    setModalType(type);
    setStakingId(stakingId);
  };
  const handleClose = () => {
    setModalVisible(false);
  };

  return useObserver(() => {
    return (
      <MainContainer className="MainContainer">
        <Header />
        <StakingBox />
        <Dividence />
        {Store.stakedPools &&
          Store.stakedPools.length > 0 &&
          Store.stakedPools.map(elem => {
            return !elem.claimed ? (
              <StatkingInfoBox stakingInfo={elem} handleClaim={handleClaim} />
            ) : null;
          })}
        <CustomModal
          visible={modalVisible}
          onRequestClose={handleClose}
          type={modalType}
          stakingId={stakingId}
        />
      </MainContainer>
    );
  });
};
export default Main;

const MainContainer = styled.div`
  display: flex;
  flex-flow: column;
  color: blue;
  height: 100vh;
  /* background-color: red; */
  min-width: 320px;
  max-width: 640px;
  margin: 1.5rem auto 1.5rem auto;
`;

const Dividence = styled.div`
  margin: 1rem;
  height: 2px;
  background-color: #74564a;
`;
