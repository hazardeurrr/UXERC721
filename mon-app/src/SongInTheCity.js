import React, { Component } from 'react';
import abi from './SongInTheCityABI';
import Button from '@material-ui/core/Button';


class SongInTheCity extends Component {
  constructor(props) {
    super()
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined}
  }

  async componentWillMount() {
      const instance = await new this.props.web3.eth.Contract(abi.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
      this.setState({contract: instance})
      console.log(instance)
      this.infosFromContract(this.state.contract)
  }

  async infosFromContract(instance) {
    this.setState({contract: instance})
    this.setState({contractName: await instance.methods.name().call()})
    this.setState({totalNumberToken: await instance.methods.tokenCounter().call()})
    instance.methods.tokenURI(0).call().then(uri => {
      fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ URIContent: data });
      })
    })
  }

  async creditToken(){
    
    await this.state.contract.methods.claimAToken().call()    
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h2>Song For The City</h2>
        <p>{this.state.contractName}</p>
        <p>{this.state.totalNumberToken}</p>
        <p>{this.state.URIContent}</p>

        <Button variant="outlined" onClick={() => this.creditToken()}>GET TOKEN</Button>
      </div>
    );
  }
}
export default SongInTheCity;