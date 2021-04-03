import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import abiTD from './ToutDoucementABI'
import abiSFTC from './SongInTheCityABI'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {address: undefined, receiver: undefined, tokenId: undefined, contractName: '' }
    }
  async componentWillMount() {
  }

  async handleTransfer(e) {
        e.preventDefault()
        console.log('submited')
        this.setState({receiver: e.target.receiver.value})
        this.setState({tokenId: e.target.tokenId.value})
        if (this.state.contractName !== 'Tout Doucement' || this.state.contractName !== 'Song for the City') {
            window.alert('Veuillez selectionner un contrat valide')
            return
        }
        // const currentContract  = this.loadContract(this.state.contractName)
        // currentContract.methods.TransferFrom(this.state.address, this.state.receiver, this.state.tokenId).send({from: this.state.address})
  }

    async loadContract(contractName) {
    if (contractName === 'Tout Doucement') {
        // Loading Tout Doucement contract
        return await new this.props.web3.eth.Contract(abiTD.abi, '0x89150a0325ecc830a2304a44de98551051b4f466')
    }
    else if (contractName === 'Song for the City') {
        // Loading Song For The City contract
        return await new this.props.web3.eth.Contract(abiSFTC.abi, '0x004a84209a0021b8ff182ffd8bb874c53f65e90e')
    }
    else {
        window.alert('Veuillez selectionner un contrat valide')
        return
    }
  }


  handleChange(value) {
    this.setState({contractName: value})
  };

  render() {

    const { contractName } = this.state;

    return (
      <div>
          <Card style={{width: "35%", textAlign: 'center',margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>
                <Typography variant="h3" component="h4" gutterBottom >Transférez vos tokens</Typography>
                <form onSubmit={this.handleTransfer}>
                    <FormGroup>
                        <FormControl >
                            <InputLabel id="contractName">Nom du contrat</InputLabel>
                            <Select
                            labelId="contractName"
                            id="contract"
                            value={contractName}
                            onChange={event => this.handleChange(event.target.value)}
                            >
                            <MenuItem value='Tout Doucement'>Tout Doucement</MenuItem>
                            <MenuItem value='Song for the City'>Song for the City</MenuItem>
                            </Select>
                            <FormHelperText>Selectionner le contrat du NFT à transférer</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="my-input">Entrez l'adresse du destinataire</InputLabel>
                            <Input id="receiver" aria-describedby="my-helper-text" />
                            <FormHelperText id="my-helper-text">Cette adresse ne peut pas etre la votre</FormHelperText>
                        </FormControl>
                    
                        <FormControl>
                            <InputLabel htmlFor="my-input">Entrez l'ID du token à transférer</InputLabel>
                            <Input id="tokenId" aria-describedby="my-helper-text" />
                            <FormHelperText id="my-helper-text">Reportez vous à votre portefeuille de token NFT</FormHelperText>
                        </FormControl>
                        <Button type="submit" variant="contained" color="primary" style={{width: "20%", textAlign: 'center', margin: 'auto'}} >
                            Envoyer
                        </Button>
                    </FormGroup>
                </form>
          </Card>
      </div>
    )}
}

export default App;