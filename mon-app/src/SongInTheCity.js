import React, { Component} from 'react';
import abi from './SongInTheCityABI';
import TokenGrid from './TokenGrid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';


class SongInTheCity extends Component {
  constructor(props) {
    super()
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined, nft: {url: undefined, name: undefined, description: undefined }, token: {txHash: undefined, confirmationNumber: undefined}, dataTokensOfOwner: undefined}  
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
        console.log(Object.keys(data.properties))
        console.log(data.properties.image.description)
        this.setState({ nft: {url: data.properties.image.description, name: data.properties.name.description, description: data.properties.description.description} });
      })
    })
  }

  async creditToken(){
    console.log(this.props.address)
    console.log()
    //this.props.web3.eth.defaultAccount = this.props.web3.eth.accounts[0]; // = this.props.address  ou  web3.eth.accounts[0] ???
    //console.log(this.props.web3.eth.accounts[0])   is undefined ='(
    this.state.contract.methods.claimAToken().send({from : this.props.address[0]})
    .on('transactionHash', function(hash){
      this.setState({token: {txHash: hash}})
    }.bind(this))
    .on('confirmation', function(confirmationNumber, receipt) {
      this.setState({token: {confirmationNumber: confirmationNumber}})
      console.log(confirmationNumber)
    }.bind(this))
    .on('receipt', function(receipt){
        console.log(receipt);
    })
  }

  async displayToken(){
    const nbTokens = this.state.contract.methods.balanceOf(this.props.address[0])
    for (var i = 0; i <= nbTokens; i++) {
      this.displayToken(this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i));
    }
  }

  displayToken(){

  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        <h2>Song For The City</h2>
        <p>Nom du contrat : {this.state.contractName}</p>
        <p>Nombre total de tokens : {this.state.totalNumberToken}</p>
        <Avatar alt="Remy Sharp" src={this.state.nft.url} />
        <Button variant="outlined" onClick={() => this.creditToken()}>GET TOKEN</Button>
        <p>Hash : {this.state.token.txHash}</p>
        <p>Confirmations : {this.state.token.confirmationNumber}</p>
        <TokenGrid tileData={this.state.dataTokensOfOwner}></TokenGrid>
      </div>
    );
  }
}

export default SongInTheCity;