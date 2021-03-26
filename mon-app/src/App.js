import React, { Component } from 'react';
import Web3 from 'web3';
import SongInTheCity from './SongInTheCity'
import ToutDoucement from './ToutDoucement'
// var songABI = require ("./SongForTheCityABI.js");
// var songContract = web3.eth.contract(songforthecity);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false, chainId: undefined, lastBlockNumber: undefined, address: undefined, accounts: []};
    this.web3 = undefined
  }

  async loadWeb3() {
    console.log('window eth :',window.ethereum)
    if (window.ethereum !== undefined) {
      this.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.setState({isConnected: true});
    } else {
      window.alert(
        'Metamask not detected! Install Metamask plugin to proceed: https://metamask.io/download.html'
      )
      this.setState({isConnected: false});
    }
  }

  async componentWillMount() {
    this.loadWeb3()
    console.log(this.web3)
    this.setUpAccount()
  }

  async setUpAccount() {
    this.setState({chainId: this.web3.utils.hexToNumber(window.ethereum.chainId)})
    this.setState({lastBlockNumber: await this.web3.eth.getBlockNumber()})
    this.setState({address: await this.web3.eth.getAccounts()})
    window.ethereum.on('accountsChanged', (accounts) => {
      this.setState({address: accounts})
    });
  }


  render() {
    return (
      <div>
        <h2>Is connected?:</h2><br/>
        {this.state.isConnected ? 'Connected to Metamask':'Not Connected'}
        <h2>Infos</h2>
        <ul>
          <li>Chain Id : {this.state.chainId}</li>
          <li>Last Block Number : {this.state.lastBlockNumber}</li>
          <li>Address : {this.state.address}</li>
        </ul>
        <SongInTheCity web3 = {this.web3} address = {this.state.address}></SongInTheCity>
        <ToutDoucement web3 = {this.web3} address = {this.state.address}></ToutDoucement>
      </div>
    );
  }
}
export default App;