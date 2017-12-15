import React from 'react'
import {promisify} from './util'

export default class EthAccount extends React.Component {

  constructor(props) {
    super(props)
    let notInstalled = true;
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      notInstalled = false
      promisify(web3)
    }

    // ステートオブジェクト
    this.state = {
      accountIndex: this.props.acidx,
      address: "N/A",
      balance: 0,
      hasError: false,
      isLoading: false,
      notInstalledMetaMask: notInstalled
    }
  }

  componentWillMount() {
    const {acidx} = this.props
    if(!this.state.notInstalledMetaMask) {
      let account = web3.eth.accounts[this.state.accountIndex];
      this.setState({address: account})
    }
  }

  async fetchAccount() {
    this.setState({
      isLoading: true,
      hasError: false
    })
    try {
      let res = await web3.eth.getBalancePromise(this.state.address)
      this.setState({
        isLoading: false,
        balance: res.toNumber()
      })
    } catch (e) {
      this.setState({hasError: true})
      console.error(e)
    }
  }

  componentDidMount() {
    if (!this.state.notInstalledMetaMask) {
      this.fetchAccount()
    }
  }

  render() {
    if (this.state.notInstalledMetaMask) {
      return <p>No web3? You should consider trying <a href="https://metamask.io/">MetaMask</a>!</p>
    } else if (this.state.hasError) {
      return <p>error</p>
    } else if (this.state.isLoading) {
      return <p>loading....</p>
    } else {
      return (
          <div>
            <div>
              address: {this.state.address}
            </div>
            <div>
              balance: {this.state.balance} wei
            </div>
          </div>
      )
    }
  }
}

