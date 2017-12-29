import React from 'react'
import ReactDOM from 'react-dom'
import {promisifyWeb3} from './util'
import {Alert, Button, ControlLabel, FormControl, FormGroup, Panel} from 'react-bootstrap'
import FunctionCaller from './function_caller'

export default class ContractUI extends React.Component {
  constructor(props) {
    super(props)
    let notInstalled = true;
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      notInstalled = false
      promisifyWeb3(web3)
    }

    // ステートオブジェクト
    this.state = {
      hasError: false,
      errorMsg: "",
      jsonParseError: null,
      jsonParseErrorMsg: "",
      isLoading: false,
      notInstalledMetaMask: notInstalled,
      contract: {},
      powresult: ""
    }

    this.createContract = this.createContract.bind(this)
    this.getAlert = this.getAlert.bind(this)
  }

  createContract(event) {
    try {
      this.setState({
        contract: {},
        jsonParseError: null
      })

      const abi = JSON.parse(ReactDOM.findDOMNode(this.refs.abiCode).value)
      const address = ReactDOM.findDOMNode(this.refs.contractAddress).value
      const obj = web3.eth.contract(abi).at(address)
      this.setState({
        contract: obj
      })
    } catch (e) {
      console.error(e)
      this.setState({
        contract: {},
        jsonParseError: "error",
        jsonParseErrorMsg: e.message
      })
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  // show json parse error message
  getAlert() {
    if (this.state.jsonParseError === "error") {
      return (<Alert bsStyle={"danger"}>{this.state.jsonParseErrorMsg}</Alert>)
    } else {
      return ""
    }
  }

  render() {
    if (this.state.notInstalledMetaMask) {
      return <p>No web3? You should consider trying <a href="https://metamask.io/">MetaMask</a>!</p>
    } else if (this.state.hasError) {
      return <p>{this.state.errorMsg}: {this.state.address}</p>
    } else if (this.state.isLoading) {
      return <p>loading....</p>
    } else {
      console.log("contract", this.state.contract)
      const functions = this.state.contract.abi ? this.state.contract.abi : []
      return (
          <div>
            <Panel header={<h3>settings</h3>}>
              <FormGroup validationState={this.state.jsonParseError}>
                <ControlLabel>abi</ControlLabel>
                <FormControl componentClass="textarea"
                             placeholder="input abi code"
                             ref="abiCode"
                             defaultValue={""}/>
                <FormControl.Feedback/>
                {this.getAlert()}
              </FormGroup>
              <FormGroup key={"address-input-formgroup"}>
                <ControlLabel>address</ControlLabel>
                <FormControl componentClass="input"
                             placeholder="contract address"
                             ref="contractAddress"
                             defaultValue={""}/>
              </FormGroup>
              <Button bsStyle={"primary"} bsSize={"large"} onClick={this.createContract}>Analyze</Button>
            </Panel>
            <Panel header={<h3>functions</h3>}>
              {functions.filter((data) => data.type == 'function').map((data, i, a) => {
                return <FunctionCaller contract={this.state.contract} functionAbi={data}
                                         key={`input-for-function-${i}-${this.state.contract.address}`}/>
              })}
            </Panel>
          </div>
      )
    }
  }
}

