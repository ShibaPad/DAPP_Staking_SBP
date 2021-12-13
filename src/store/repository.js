import Web3 from 'web3';
import Web3EthContract from 'web3-eth-contract';
const { ethereum } = window;

const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
let web3;
let abi_SBP;
let abi_staking;
let CONFIG_SBP;
let CONFIG_staking;
if (metamaskIsInstalled) {
  Web3EthContract.setProvider(ethereum);
  web3 = new Web3(ethereum);
}

const Repository = {
  fetchContract: async () => {
    abi_SBP = await fetch('/config/abi_SBP.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(res => {
      return res.json();
    });
    abi_staking = await fetch('/config/abi_staking.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(res => {
      return res.json();
    });
    CONFIG_SBP = await fetch('/config/config_SBP.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(res => {
      return res.json();
    });
    CONFIG_staking = await fetch('/config/config_staking.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(res => {
      return res.json();
    });
    const smartContractObj_SBP = new Web3EthContract(
      abi_SBP,
      CONFIG_SBP.CONTRACT_ADDRESS,
    );
    const smartContractObj_staking = new Web3EthContract(
      abi_staking,
      CONFIG_staking.CONTRACT_ADDRESS,
    );
    return {
      smartContract_SBP: smartContractObj_SBP,
      smartContract_staking: smartContractObj_staking,
      web3: web3,
    };
  },

  walletConnect: async () => {
    if (metamaskIsInstalled) {
      try {
        const [accounts] = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        const networkId = await ethereum.request({
          method: 'net_version',
        });
        if (networkId == CONFIG_staking.NETWORK.ID) {
          return accounts;

          // Add listeners end
        } else {
          throw 'netErr';
        }
      } catch (err) {
        if (err === 'netErr')
          throw `Change network to ${CONFIG_staking.NETWORK.NAME}.`;
        else throw new Error('Something went wrong.');
      }
    }
  },
  getTVL: async contract => {
    try {
      const res = await contract.StakerTVL().call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting Total_Value_Locked !');
    }
  },
  approveMaxBalance: async ({ contract, stakingAddress, account }) => {
    try {
      const res = await contract.approveMax(stakingAddress).send({
        from: account,
      });
      return res;
    } catch (err) {
      throw new Error('Failed Getting ApproveMax');
    }
  },
  getAllowance: async ({ contract, stakingAddress, account }) => {
    try {
      console.log('111');
      const res = await contract.allowance(account, stakingAddress).call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting Allowance');
    }
  },
  getAccountStakingTotal: async ({ contract, account }) => {
    try {
      const res = await contract.AccountStakingTotal(account).call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting Account Staking Total !');
    }
  },
  getTotalExpectedReward: async ({ contract, account }) => {
    try {
      const res = await contract.getTotalRewardsExpected(account).call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting Account Staking Total !');
    }
  },
  getAccountTier: async ({ contract, account }) => {
    try {
      const res = await contract.AccountTier(account).call();
      if (res===2) {
        return 'Silver';
      } else if (res===3){
        return 'Gold'
      } else if (res===4){
        return 'Platinum'
      } else if (res===5){
        return 'Diamond'
      } else { return 'None'}
    } catch (err) {
      throw new Error('Failed Getting Accounnt Tier !');
    }
  },
  getSBPBalance: async ({ contract, account }) => {
    try {
      const res = await contract.balanceOf(account).call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting Balance !');
    }
  },
  getPenaltyFee: async ({ contract }) => {
    try {
      const res = await contract.getPenaltyFee().call();
      // console.log(res);
      return res;
    } catch (err) {
      throw new Error('Failed Getting PenaltyFee');
    }
  },
  getStorageNumbers: async ({ contract }) => {
    try {
      const res = await contract.getStorageNumbers().call();
      // console.log('storageNum: ', res);
      return res;
    } catch (err) {
      throw new Error('Failed Getting Pool Number');
    }
  },
  getPoolInfo: async ({ contract, storageID }) => {
    try {
      const res = await contract.storages(storageID).call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting Pool Number');
    }
  },
  getStakeIds: async ({ contract, account }) => {
    try {
      const res = await contract.StakeIDs(account).call();
      return res;
    } catch (err) {
      throw new Error('Failed Getting StakeIDs');
    }
  },
  getStakedPool: async ({ contract, account, stakeIds }) => {
    try {
      const res = await contract.pools(account, stakeIds).call();
      return res;
    } catch (err) {
      throw new Error('Faild Getting Pool Info');
    }
  },
  stakeSBP: async ({ contract, amount, storageId, account }) => {
      var amounts = web3.utils.toWei(''+amount,'ether');
      const res = await contract.StakeSBP(amounts, storageId).send({
        from: account,
      });
      // console.log('res', res);
      return res;

  },
  unStake: async ({ contract, stakedId, account }) => {
    try {
      const res = await contract.unstakeSBP(stakedId).send({
        from: account,
      });
      // console.log('unstakeSBP', res);
      return res;
    } catch (err) {
      throw new Error('Failed Claim Reward');
    }
  },
  earlyClaimSBP: async ({ contract, stakedId, account }) => {
    try {
      const res = await contract.earlyClaimSBP(stakedId).send({
        from: account,
      });
      // console.log('earlyClaimSBP', res);
      return res;
    } catch (err) {
      throw new Error('Failed Claim Early Reward');
    }
  },
  getStakeStatus: async ({ contract, stakedId, account }) => {
    try {
      return await contract.StakeStatus(account, stakedId).call();
    } catch (err) {
      throw new Error('Failed get Staking Status');
    }
  },
  getExpectedPoolReward: async ({ contract, stakedId, account }) => {
    try {
      return await contract.expectedPoolReward(account, stakedId).call();
    } catch (err) {
      throw new Error('Failed get ExpectedPoolReward');
    }
  },
};

export default Repository;
