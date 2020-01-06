import React, { useState } from 'react'
import { withTheme } from 'react-jsonschema-form'
import { Theme as MuiTheme } from 'rjsf-material-ui'
import SchemaCreator from '../components/schema-creator'
const Form = withTheme(MuiTheme)
const AceEditor = (props) => {
  if (typeof window !== 'undefined') {
    const Ace = require('react-ace').default
    require('ace-builds/src-noconflict/mode-javascript')
    require('ace-builds/src-noconflict/theme-monokai')

    return <Ace {...props} />
  }

  return null
}
const defaultSchema = `
{
  "schema": {
    "title": "this is a test",
    "description": "this is a test desc",
    "type": "object",
    "required": [],
    "properties": {
      "text": {
        "type": "string",
        "title": "test thing"
      }
    }
  },
  "ui": {
    "text": {
      "ui:widget": "textarea"
    }
  }
}
`
class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch (error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo)
  }

  render () {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children
  }
}
class Editor extends React.Component {
  constructor () {
    super()
    this.state = {mounted: false}
  }

  componentDidMount () {
    this.setState({mounted: true})
  }

  render () {
    return (this.state.mounted ? <AceEditor {...this.props} /> : null)
  }
}
export default function App () {
  let schema = {ui: {}, schema: {title: 'Default Schema Title', description: 'Default description', type: 'object', properties: {}}}
  const [code, setCode] = useState(schema)
  try {
    schema = JSON.parse(code)
  } catch (e) {
    //
  }

  console.log(schema, code)

  return (
    <div>
      <ErrorBoundary>
        <div style={{ float: 'left ', width: '50%' }}>
          <Editor
            placeholder='Placeholder Text'
            mode='javascript'
            theme='monokai'
            name='blah2'
            onLoad={console.log}
            onChange={(value) => {
              console.log('Editor on change', value)
            }}
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={JSON.stringify(code, null, 2)}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </div>
        <div style={{ float: 'right', width: '50%' }}>
          <SchemaCreator
            onChange={e => console.log('change', e)}
            onSubmit={e => {
              const properties = Object.assign({}, code.schema.properties, {[e.schema.title]: e.schema})
              const ui = Object.assign({}, code.ui, {[e.schema.title]: e.ui})
              const newCode = Object.assign({}, code)
              newCode.ui = ui
              newCode.schema.properties = properties
              setCode(newCode)
            }}
            onError={e => console.log('errors', e)}
          />
        </div>
        <div style={{clear: 'both'}}>
          <Form schema={code.schema} uiSchema={code.ui} />
        </div>
      </ErrorBoundary>
    </div>
  )
}
