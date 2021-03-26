import React, { Component } from 'react';
import abi from './ToutDoucementABI';
import Button from '@material-ui/core/Button';


class ToutDoucement extends Component {
  constructor(props) {
    super()
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined}
  }

  async componentWillMount() {
      const instance = await new this.props.web3.eth.Contract(abi.abi, '0x89150a0325ecc830a2304a44de98551051b4f466')
      this.setState({contract: instance})
      console.log(instance)
  }

  async buyToken(){
    console.log(this.props.address)
    this.props.web3.eth.defaultAccount = '0xcd4528Edc220b5a7c7DDd7873FA692f486636E31'; // = this.props.address
    // gasValue = this.state.contract.methods.buyAToken.estimateGas(...)
    this.state.contract.buyAToken({from: this.props.web3.eth.accounts[0], gas: 35000, value: 100000000000000001}, function(err, res){ }) // methods. ???
    // change from => use this.state.address instead of web3.eth.accounts[0] which is undefined ???
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h2>Tout Doucement</h2>        

        <Button variant="outlined" onClick={() => this.buyToken()}>BUY TOKEN (0.1ETH)</Button>
      </div>
    );
  }
}
export default ToutDoucement;