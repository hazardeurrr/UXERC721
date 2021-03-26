import React, { Component } from 'react';
import abi from './SongInTheCityABI';

class SongInTheCity extends Component {
  constructor(props) {
    super()
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined}
  }

  async componentWillMount() {
      console.log(abi)
      const instance = new this.props.web3.eth.Contract(abi.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
      console.log(instance)
  }

  async infosFromContract() {
  }

  render() {
    return (
      <div>
        <h2>Song For The City</h2>
        <p></p>
      </div>
    );
  }
}
export default SongInTheCity;