import React from 'react'
import {promisify, delay} from './util'

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
      reconnect: 0,
      accountIndex: this.props.acidx,
      address: "N/A",
      balance: 0,
      hasError: false,
      errorMsg: "",
      isLoading: false,
      notInstalledMetaMask: notInstalled
    }
  }

  componentWillMount() {
    console.log("willMount: acidx=", this.props.acidx)
    const {acidx} = this.props

    if (!this.state.notInstalledMetaMask) {
      this.setState({
        isLoading: true,
        hasError: false
      })
      this.fetchAccount()
    }
  }

  async fetchAccount() {
    try {
      let account = await web3.eth.accounts[this.state.accountIndex]
      if (account == undefined) {
        console.log("reconecting.... ", this.state.reconnect)
        if(this.state.reconnect < 10) {
          this.setState({
            reconnect: this.state.reconnect + 1
          })
          await delay(1000)
          this.fetchAccount()
        } else {
          throw "do not get address."
        }
      } else {
        console.log(account)
        let res = await web3.eth.getBalancePromise(account)
        this.setState({
          isLoading: false,
          address: account,
          balance: res.toNumber()
        })
      }
    } catch (e) {
      this.setState({hasError: true})
      console.error(e)
      this.setState({
        errorMsg: e.toString()
      })
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

