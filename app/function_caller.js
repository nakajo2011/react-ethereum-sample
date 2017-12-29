import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {promisefy} from './util'
import {Button, Col, FormControl, FormGroup, InputGroup, Label, Row} from 'react-bootstrap'

const ropstenEtherScanURL = "https://ropsten.etherscan.io/tx/"
// Contractのfunctionを実行するコンポーネント
export default class FunctionCaller extends React.Component {
  constructor(props) {
    super(props)
    // ステートオブジェクト
    const args = this.props.functionAbi.inputs.map((v) => v.type).join(",")
    const label = this.props.functionAbi.name + `(${args})`
    this.state = {
      contract: this.props.contract,
      functionAbi: this.props.functionAbi,
      buttonStyle: this.props.functionAbi.constant ? "info" : "warning",
      buttonLabel: this.props.functionAbi.constant ? "call" : "sendTransaction",
      resultStyle: {},
      args: args,
      label: label,
      result: "",
      show: true
    }

    this.toggleShow = this.toggleShow.bind(this)
    this.exec = this.exec.bind(this)
  }


  componentDidMount() {
    // for fiting height divs of input and result.
    const inputNode = ReactDOM.findDOMNode(this.refs.inputCol)
    const height = inputNode.clientHeight + "px"
    const resultStyle = {
      borderBottom: "1px solid",
      minHeight: height
    }

    this.setState({
      resultStyle: resultStyle
    })
  }

  toggleShow(event) {
    event.preventDefault()
    this.setState({
      show: !this.state.show
    })
  }

  // contractのメソッドを実行します。
  async exec() {
    try {
      const func = this.state.contract[this.state.functionAbi.name]
      let result, args = undefined
      if (this.inputArgs.value.length > 0) {
        args = this.inputArgs.value.split(",").map((s) => s.trim())
      }
      if(args) {
        result = await promisefy(func, ...args)
      } else {
        result = await promisefy(func)
      }
      this.setState({
        result: result.toString()
      })
    } catch (e) {
      console.error(e)
      let errorMsg = (<span style={{color: "red"}}>{e.message}</span>)
      this.setState({
        result: errorMsg
      })
    }
  }

  render() {
    let inputCssClass = this.state.show ? "input-group" : "hide"
    let resultCssClass = this.state.show ? "col" : "hide col"
    let toggleLabel = this.state.show ? " hide" : " show"

    let result = this.state.result
    if(!this.state.functionAbi.constant) {
      //convert to ether scan link
      result = (<a href={ropstenEtherScanURL+this.state.result} target="_blank">{this.state.result}</a>)
    }
    return (
        <FormGroup>
          <Row>
            <Col xs={4} ref="inputCol">
              <Label>
                {this.state.label}
              </Label>
              <a href="#" onClick={this.toggleShow}>{toggleLabel}</a>
              <InputGroup bsClass={inputCssClass}>
                <FormControl type="input" placeholder={this.state.args} inputRef={(ref) => {
                  this.inputArgs = ref
                }}/>
                <InputGroup.Button>
                  <Button bsStyle={this.state.buttonStyle} onClick={this.exec}>{this.state.buttonLabel}</Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
            <Col xs={4} bsClass={resultCssClass} style={this.state.resultStyle}>
              {result}
            </Col>
          </Row>
        </FormGroup>
    )
  }
}

FunctionCaller.propTypes = {
  functionAbi: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired
}