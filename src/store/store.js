import { observable } from 'mobx';
import Repository from './repository';

const { ethereum } = window;
const Store = observable({
  account: null,
  stakingContract: null, //SHIBA STAKING SMART CONTRACT
  SBPContract: null, // $SBP SMART CONTRACT
  web3: null,
  stakingInfo: {
    TVL: '', // total value locked
    accountStakingTotal: 0, // Your SBPS in Staking
    totalExpectedReward: 0, // Total Expected Reward
    tier: '', // Account Tier
    SBPBalance: 0, // Account $SBP Balance
    allowance: 0,
  },
  stakingPool: [], //Staking Pools
  stakeIDs: [], // StakeIDs of Account
  stakedPools: [], //Staked Pool of Account
  paneltyFee: 0, // Panelty Fee
  liqfee: 0,

  async fetchContract() {
    try {
      await Repository.fetchContract().then(res => {
        if (res) {
          const { smartContract_SBP, smartContract_staking, web3 } = res;
          this.stakingContract = smartContract_staking;
          this.SBPContract = smartContract_SBP;
          this.web3 = web3;
        }
      });
      return true;
    } catch (err) {
      // console.log('err: ', err);
    }
  },
  async connectWallet() {
    try {
      await Repository.walletConnect().then(res => {
        if (res) {
          this.account = res;
          this.fetchAccountInfo();
        }
      });
      return { result: true, msg: 'Succeed Connect Wallet' };
    } catch (err) {
      return { result: false, msg: err };
    }
  },
  addAccountListner(fetch) {
    ethereum.on('accountsChanged', ([accounts]) => {
      this.account = accounts;
      this.stakeIDs = [];
      this.stakedPools = [];
      fetch();
    });
    ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  },
  fetchAccountInfo() {
    this.getAllowance();
    this.getAccountStakingTotal();
    this.getTotalExpectedReward();
    this.getAccountTier();
    this.getSBPBalance();
    this.getStakeIds();
    this.getTVL();
  },
  async getTVL() {
    try {
      await Repository.getTVL(this.stakingContract.methods).then(res => {
        if (res) this.stakingInfo.TVL = res;
      });
    } catch (err) {
      return err;
    }
  },
  async ApproveMaxBalance() {
    try {
      await Repository.approveMaxBalance({
        contract: this.SBPContract.methods,
        stakingAddress: this.stakingContract._address,
        account: this.account,
      });

      this.getAllowance();
      return { result: true, msg: 'Approval Success' };
    } catch (err) {
      return { result: false, msg: 'Failed Approval' };
    }
  },

  async getAllowance() {
    try {
      await Repository.getAllowance({
        contract: this.SBPContract.methods,
        stakingAddress: this.stakingContract._address,
        account: this.account,
      }).then(res => {
        if (res) this.stakingInfo.allowance = res;
      });
    } catch (err) {
      return err;
    }
  },
  async getAccountStakingTotal() {
    try {
      await Repository.getAccountStakingTotal({
        contract: this.stakingContract.methods,
        account: this.account,
      }).then(res => {
        if (res) this.stakingInfo.accountStakingTotal = res;
      });
    } catch (err) {
      return err;
    }
  },

  async getTotalExpectedReward() {
    try {
      await Repository.getTotalExpectedReward({
        contract: this.stakingContract.methods,
        account: this.account,
      }).then(res => {
        if (res) this.stakingInfo.totalExpectedReward = res;
      });
    } catch (err) {
      return err;
    }
  },
  async getAccountTier() {
    try {
      await Repository.getAccountTier({
        contract: this.stakingContract.methods,
        account: this.account,
      }).then(res => {
        if (res) this.stakingInfo.tier = res;
      });
    } catch (err) {
      return err;
    }
  },
  async getSBPBalance() {
    try {
      await Repository.getSBPBalance({
        contract: this.SBPContract.methods,
        account: this.account,
      }).then(res => {
        if (res) this.stakingInfo.SBPBalance = res;
      });
      return true;
    } catch (err) {
      return err;
    }
  },
  async getPenaltyFee() {
    try {
      await Repository.getPenaltyFee({
        contract: this.stakingContract.methods,
      }).then(res => {
        if (res) this.paneltyFee = res;
      });
    } catch (err) {
      return err;
    }
  },
  async getStakingPool() {
    //storageID
    try {
      this.stakingPool = [];
      await Repository.getStorageNumbers({
        contract: this.stakingContract.methods,
      }).then(async res => {
        if (res && res > 0) {
          let poolInfo = [];
          for (let i = 0; i < res; i++) {
            let pool = await Repository.getPoolInfo({
              contract: this.stakingContract.methods,
              storageID: i + 1,
            });
            poolInfo.push({ storageId: i + 1, ...pool });
          }
          this.stakingPool = poolInfo;
        }
        // console.log('stakingPool: ', this.stakingPool);
      });
    } catch (err) {
      return err;
    }
  },
  async getStakeIds() {
    // stakedid
    try {
      this.stakedPools = [];
      await Repository.getStakeIds({
        contract: this.stakingContract.methods,
        account: this.account,
      }).then(async res => {
        if (res && res.length > 0) {
          this.stakeIDs = res;
          for (let i = 0; i < res.length; i++) {
            await this.getStakedPool(res[i]).then(res => {
              if (res) this.stakedPools.push(res);
            });
          }
          setTimeout(() => {}, 3000);
        }
      });
    } catch (err) {}
  },
  async getStakedPool(stakeId) {
    //staking stakeid로 pool 
    try {
      const res = await Repository.getStakedPool({
        contract: this.stakingContract.methods,
        account: this.account,
        stakeIds: stakeId,
      });
      return { ...res, stakingId: stakeId };
    } catch (err) {
      console.log(err);
    }
  },
  async stakeSBP({ amount, storageId }) {
      await Repository.stakeSBP({
        contract: this.stakingContract.methods,
        amount: amount,
        storageId: storageId,
        account: this.account,
      });
      return { result: true, msg: 'Succeed Staking SBP' };

  },
  async unStakeSBP(stakedId) {
    try {
      await Repository.unStake({
        contract: this.stakingContract.methods,
        stakedId: stakedId,

        account: this.account,
      });
      return { result: true, msg: 'Succeed Claim Reward' };
    } catch (err) {
      return { result: false, msg: 'Failed Claim Reward' };
    }
  },
  async earlyClaimSBP(stakedId) {
    try {
      await Repository.earlyClaimSBP({
        contract: this.stakingContract.methods,
        stakedId: stakedId,
        account: this.account,
      });
      return { result: true, msg: 'Succeed Early Claim Reward' };
    } catch (err) {
      return { result: false, msg: 'Failed Claim Early Reward' };
    }
  },
  async getStakeStatus(stakedId) {
    try {
      return await Repository.getStakeStatus({
        contract: this.stakingContract.methods,
        stakedId: stakedId,
        account: this.account,
      });
    } catch (err) {
      //
    }
  },
  async getExpectedPoolReward(stakedId) {
    try {
      return await Repository.getExpectedPoolReward({
        contract: this.stakingContract.methods,
        stakedId: stakedId,
        account: this.account,
      });
    } catch (err) {
      //
    }
  },
});

export default Store;
