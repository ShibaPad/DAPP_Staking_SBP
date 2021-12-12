import React from 'react';
import Modal from 'react-modal';
import backGoundImg from '../assets/background.png';
import styled from 'styled-components';
import Store from '../store/store';
import { useAlert } from 'react-alert';
const CustomModal = ({ visible, onRequestClose, type, stakingId }) => {
  const alert = useAlert();
  const handleClaim = () => {
    if (type === 'claim') {
      Store.unStakeSBP(stakingId).then(res => {
        if (res.result) {
          alert.show(res.msg, { type: 'success' });
          Store.fetchAccountInfo();
        } else {
          alert.show(res.msg, { type: 'error' });
        }
      });
    } else {
      Store.earlyClaimSBP(stakingId).then(res => {
        if (res.result) {
          alert.show(res.msg, { type: 'success' });
          Store.fetchAccountInfo();
        } else {
          alert.show(res.msg, { type: 'error' });
        }
      });
    }

    onRequestClose();
  };
  return (
    <Modal
      isOpen={visible}
      onRequestClose={() => onRequestClose()}
      style={style}
    >
      <TextWrapper>
        {type === 'claim'
          ? 'Do you want to claim?'
          : `You can't earn any reward & will lose tokens from entrance fees by Emergency claim`}
      </TextWrapper>
      <ButtonWrapper>
        <Button onClick={handleClaim}>
          {type === 'claim' ? 'Claim' : 'Emergency Claim'}
        </Button>
        <Button onClick={onRequestClose}>Cancel</Button>
      </ButtonWrapper>
    </Modal>
  );
};

const style = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  content: {
    // text: 'Teko',

    fontFamily: 'Teko',
    fontSize: '1.5rem',
    fontWeight: '500',
    color: '#fff',
    position: 'absolute',
    top: '40px',
    left: '40px',
    right: '40px',
    bottom: '40px',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
    padding: '20px',
    width: '20rem',
    height: '10rem',
    margin: 'auto',
    borderRadius: '15px',
    border: 'solid 2px #f6c179',
    backgroundImage: `url(${backGoundImg})`,
    backgroundSize: '500px',
    display: 'flex',
    flexFlow: 'column',
  },
};
export default CustomModal;
const TextWrapper = styled.div`
  height: 10rem;
`;
const ButtonWrapper = styled.div`
  display: flex;
`;
const Button = styled.button`
  width: 8rem;
  border-radius: 1rem;
  border: solid 2px #d5ccc8;
  background-color: #66ac5b;
  font-family: Teko;
  font-size: 1.3rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  margin: auto;
`;
