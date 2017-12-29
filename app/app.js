import React from 'react'
import EthAccount from './ethAccount'
import ContractUI from "./contract_ui";

export default class App extends React.Component {
  render() {
    return (
        <div style={{margin: 24}}>
          <div>
            <EthAccount acidx={0}/>
          </div>
          <div>
            <ContractUI/>
          </div>
        </div>
    )
  }
}

