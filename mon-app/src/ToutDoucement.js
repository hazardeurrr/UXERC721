import React, { Component } from 'react';
import abi from './ToutDoucementABI';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TokenGrid from './TokenGrid';

class ToutDoucement extends Component {
  constructor(props) {
    super()
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined, token: {txHash: undefined, confirmationNumber: undefined}, tileData: [], tokensOwned: []}
  }

  async componentWillMount() {
      const instance = await new this.props.web3.eth.Contract(abi.abi, '0x89150a0325ecc830a2304a44de98551051b4f466')
      this.setState({contract: instance})
      console.log(instance)
  }

  async buyToken(){
    console.log(this.props.address)
   // this.props.web3.eth.defaultAccount = '0xcd4528Edc220b5a7c7DDd7873FA692f486636E31'; // = this.props.address
    // gasValue = this.state.contract.methods.buyAToken.estimateGas(...)
    this.state.contract.methods.buyAToken().send({from: this.props.address[0], gas: 500000, gasPrice: '50000000000', value: 100000000000000101})
    .on('transactionHash', function(hash){
      this.setState({token: {txHash: hash}})
    }.bind(this))
    .on('confirmation', function(confirmationNumber, receipt) {
      this.setState({token: {confirmationNumber: confirmationNumber}})
      console.log(confirmationNumber)
    }.bind(this))
    .on('receipt', function(receipt){
        console.log(receipt);
    }) // methods. ???
  }

  async componentDidMount() {
    await this.displayToken();
  }

  async displayToken(){
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x89150a0325ecc830a2304a44de98551051b4f466')
    console.log('indisplay token :',instance)
    let nbTokens = await instance.methods.balanceOf(this.props.address[0]).call()
    console.log(nbTokens)
    let tid = undefined
    for (var i = 0; i < nbTokens; i++) {
      tid = await this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i).call()
      console.log(tid)
      this.setState({ tokensOwned: [...this.state.tokensOwned, await this.displayInfos(tid)] })
      //this.state.tokensOwned.push(this.displayInfos(this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i)));
      //this.setState({tokensOwned: [...this.state.tokensOwned, this.displayInfos(i)]})
    }
    this.preRender()
  }

  preRender() {
    this.state.tokensOwned.forEach(elt => {
      this.setState({ tileData: [...this.state.tileData, {img: elt.img, title: elt.name, author: elt.tokenId}]})
    })
    console.log("Tout doucement TileData : " + this.state.tileData)
  }

  async displayInfos(tokenId){
    console.log('TOKEN ID', tokenId)
    let img = ''
    let name = ''
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x89150a0325ecc830a2304a44de98551051b4f466')
  //  let symbol = await this.state.contract.methods.symbol().call()
    let promise = instance.methods.tokenURI(tokenId).call().then(uri => {
      let promise = fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        console.log(data.properties.name.description)
        img = data.properties.image.description
        name = data.properties.name.description
        const token = {tokenId, name, img}
        return token
      })
      return promise
    })
    return promise
  }



  render() {
    return (
      <div>
        <Card style={{width: "35%", textAlign: 'center',margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>

        <h2>Tout Doucement</h2>        
      
        <Button variant="contained" color="primary" onClick={() => this.buyToken()}>BUY TOKEN (0.1ETH)</Button>
        <p>Hash : {this.state.token.txHash}</p>
        <p>Confirmations : {this.state.token.confirmationNumber}</p>
        </Card>
        <TokenGrid tileData={this.state.tileData}></TokenGrid>
      </div>
    );
  }
}
export default ToutDoucement;