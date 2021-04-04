import React, { Component} from 'react';
import abi from './SongInTheCityABI';
import abi2 from './ToutDoucementABI';
import Card from '@material-ui/core/Card';
import ViewToken from './ViewToken'
import Typography from '@material-ui/core/Typography'


class Overview extends Component {
  constructor(props) {
    super(props)
    this.props = props
    this.state = {contract: undefined,contract2: undefined, contractName: undefined, contractName2: undefined, totalNumberToken: undefined, totalNumberToken2: undefined,
  tileData: [], tileData2: [], tokensOwned: [], tokensOwned2: [], done: false}  
  }

    async componentWillMount() {
        const instance = await new this.props.web3.eth.Contract(abi.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
        this.setState({contract: instance})
        this.setState({contractName: await instance.methods.name().call()})
        this.setState({totalNumberToken: await instance.methods.tokenCounter().call()})
        await this.displayToken();    
        const instance2 = await new this.props.web3.eth.Contract(abi2.abi, '0x89150a0325ecc830a2304a44de98551051b4f466')

        this.setState({contract2: instance2})
        this.setState({contractName2: await instance2.methods.name().call()})
        this.setState({totalNumberToken2: await instance2.methods.tokenCounter().call()})
        await this.displayToken2();
        this.state.done = true;
    }

  async componentDidMount() {
    
  }


  async displayToken(){
    const instance = this.state.contract
    let address = undefined
    for (var i = 0; i < this.state.totalNumberToken; i++) {
      address = await instance.methods.ownerOf(i).call()
      this.setState({ tokensOwned: [...this.state.tokensOwned, await this.displayInfos(address, i)] })
    }
    this.preRender()
  }
  async displayToken2(){
    const instance = this.state.contract2
    let address = undefined
    for (var i = 0; i < this.state.totalNumberToken2; i++) {
      address = await instance.methods.ownerOf(i).call()
      this.setState({ tokensOwned2: [...this.state.tokensOwned2, await this.displayInfos2(address, i)] })
    }
    this.preRender2()
  }

  preRender() {
    this.state.tokensOwned.forEach(elt => {
      this.setState({ tileData: [...this.state.tileData, {img: elt.img, title: elt.name, author: elt.tokenId, address: elt.address}]})
    })
  }
  preRender2() {
    this.state.tokensOwned2.forEach(elt => {
      this.setState({ tileData2: [...this.state.tileData2, {img: elt.img, title: elt.name, author: elt.tokenId, address: elt.address}]})
    })
  }

  async displayInfos(address, tokenId){
    let img = ''
    let name = ''
    const instance = this.state.contract
    let promise = instance.methods.tokenURI(tokenId).call().then(uri => {
      let promise = fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        img = data.properties.image.description
        name = data.properties.name.description
        const token = {tokenId, name, img, address}
        return token
      })
      return promise
    })
    return promise
  }
  async displayInfos2(address, tokenId){
    let img = ''
    let name = ''
    const instance = this.state.contract2
    let promise = instance.methods.tokenURI(tokenId).call().then(uri => {
      let promise = fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        img = data.properties.image.description
        name = data.properties.name.description
        const token = {tokenId, name, img, address}
        return token
      })
      return promise
    })
    return promise
  }



  render() {
    return (
      <div style={{textAlign: 'center'}}>
      <Typography variant="h6">This may take a while to load</Typography>
        <Card style={{width: "35%", textAlign: 'center',margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>
        <ViewToken tileData={this.state.tileData}></ViewToken>
        </Card>
        <Card style={{width: "35%", textAlign: 'center',margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>
        <ViewToken tileData={this.state.tileData2}></ViewToken>
        </Card>
        </div>
    )
  }
}

export default Overview;