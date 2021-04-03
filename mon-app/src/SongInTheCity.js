import React, { Component} from 'react';
import abi from './SongInTheCityABI';
import TokenGrid from './TokenGrid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';


class SongInTheCity extends Component {
  constructor(props) {
    super(props)
    this.props = props
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined, nft: {url: undefined, name: undefined, description: undefined }, token: {txHash: undefined, confirmationNumber: undefined},
  tileData: [], tokensOwned: []}  
  }

  async componentWillMount() {
      const instance = await new this.props.web3.eth.Contract(abi.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
      this.setState({contract: instance})
      console.log('song in the city instance : ',instance)
      this.infosFromContract(this.state.contract)

  }

  async componentDidMount() {
    console.log('address in did mount arr : ', this.props.address)
    console.log('address in did mount : ', this.props.address[0])
    await this.displayToken();

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
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
    console.log('indisplay token :',instance)
    let nbTokens = await instance.methods.balanceOf(this.props.address[0]).call()
    console.log(nbTokens)
    let tid = undefined
    let t = undefined
    for (var i = 0; i < nbTokens; i++) {
      console.log(i)
      tid = await this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i).call()
      console.log(tid)
      t = await this.displayInfos(tid)
      console.log('token from display infos', t)
      //this.state.tokensOwned.push(this.displayInfos(this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i)));
      this.setState({ tokensOwned: [...this.state.tokensOwned, t] })
      //this.setState({tokensOwned: [...this.state.tokensOwned, this.displayInfos(i)]})
    }
    
    this.preRender()
  }

  async preRender() {
    this.state.tokensOwned.forEach(elt => {
      this.setState({ tileData: [...this.state.tileData, {img: elt.img, title: elt.name, author: elt.tokenId}]})
    })
    console.log(this.state.tileData)
  }

  async displayInfos(tokenId){
    console.log('TOKEN ID', tokenId)
    let img = ''
    let name = ''
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
    console.log(instance)
  //  let symbol = await this.state.contract.methods.symbol().call()
    instance.methods.tokenURI(tokenId).call().then(uri => {
      fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        console.log(data.properties.name.description)
        img = data.properties.image.description
        name = data.properties.name.description
        const token = {tokenId, name, img}
        console.log(token)
        return token
      })
    })
  }



  render() {
    return (
      <div>
      <Card style={{width: "35%", textAlign: 'center',margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>
        <h2>Song For The City</h2>
        <p>Nom du contrat : {this.state.contractName}</p>
        <p>Nombre total de tokens : {this.state.totalNumberToken}</p>
        <Avatar alt="Remy Sharp" src={this.state.nft.url} />
        <Button variant="contained" color="primary" onClick={() => this.creditToken()}>GET TOKEN</Button>
        <p>Hash : {this.state.token.txHash}</p>
        <p>Confirmations : {this.state.token.confirmationNumber}</p>
      </Card>
      <TokenGrid tileData={this.state.tileData}></TokenGrid>
      </div>
    );
  }
}

export default SongInTheCity;