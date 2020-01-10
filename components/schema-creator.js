import { useState } from 'react'
import { validators } from '../constants/validators'
import { withTheme } from 'react-jsonschema-form'
import { Theme as MuiTheme } from 'rjsf-material-ui'
const Form = withTheme(MuiTheme)
const fieldTypes = ['text', 'textarea', 'number', 'dropdown', 'checkbox', 'radio', 'select', 'password', 'file', 'date']
const formSchema = {
  schema: {
    title: 'Create a schema',
    description: 'Do stuff idk',
    type: 'object',
    properties: {
      fieldName: {
        title: 'Name of field',
        description: 'The name for this field',
        type: 'string'
      },
      fieldDescription: {
        title: 'Description of field',
        description: 'Describes the information for this field',
        type: 'string'
      },
      fieldType: {
        title: 'Type of field',
        description: 'The type of the field text, textarea, number, etc...',
        type: 'string',
        enum: fieldTypes
      }
    },
    dependencies: {
      fieldType: {
        oneOf: [
          {
            properties: {
              fieldType: { enum: ['text', 'textarea'] },
              fieldValidation: {
                title: 'Rules for field validation',
                description: 'Which patterns need to be applied to the field',
                type: 'string',
                enum: validators.map(v => v.regex),
                enumNames: validators.map(v => v.text)
              }
            }
          },
          {
            properties: {
              fieldType: { enum: ['radio', 'checkbox', 'select'] },
              fieldOptions: {
                title: 'Radio Options',
                description: 'Which options are available for the field. Example: Label=value,Other Label=value OR value,value',
                type: 'string'
              }
            }
          }
        ]
      }
    }
  },
  ui: {
    fieldDescription: {
      'ui:widget': 'textarea'
    },
    fieldValidation: {
      'ui:widget': 'select'
    },
    fieldOptions: {
      'ui:widget': 'textarea'
    }
  }
}

function createOptionMap (optionString) {
  const keyValueMap = {}
  optionString.split(/\s?,\s?/).forEach(kv => {
    const keyValue = kv.split('=')
    if (keyValue.length === 1 || keyValue.length > 2) {
      keyValueMap[keyValue[0]] = keyValue[0]
    } else {
      keyValueMap[keyValue[0]] = keyValue[1]
    }
  })
  return keyValueMap
}

function addOptionsSchema (schema, options) {
  const opts = createOptionMap(options)
  schema.enum = Object.values(opts)
  schema.enumNames = Object.keys(opts)
  return schema
}

function generateSchema ({ formData }) {
  let schema = {
    title: formData.fieldName,
    description: formData.fieldDescription
  }
  let ui = {}
  switch (formData.fieldType) {
    case 'text':
    case 'textarea':
      schema.type = 'string'
      if (formData.fieldValidation) {
        schema.pattern = formData.fieldValidation
      }
      break
    case 'radio':
      schema.type = 'string'
      schema = addOptionsSchema(schema, formData.fieldOptions)
      ui = { 'ui:widget': 'radio' }
      break
    case 'checkbox':
      schema.type = 'array'
      schema.uniqueItems = true
      let items = {type: 'string'}
      items = addOptionsSchema(items, formData.fieldOptions)
      schema.items = items
      ui = { 'ui:widget': 'checkboxes' }
      break
    case 'select':
      schema.type = 'string'
      schema = addOptionsSchema(schema, formData.fieldOptions)
      ui = { 'ui:widget': 'select' }
      break
    default:
      schema.type = 'string'
      break
  }
  return { schema, ui }
}

export default function (props) {
  const [key, setKey] = useState(String(Math.random()))
  return (
    <Form
      key={key}
      schema={formSchema.schema}
      uiSchema={formSchema.ui}
      onChange={e => props.onChange(e)}
      onSubmit={e => {
        setKey(String(Math.random()))
        props.onSubmit(generateSchema(e))
      }}
      onError={e => props.onError(e)}
    />
  )
}
