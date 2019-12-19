export const zip = {
  type: 'regex',
  text: 'Zip',
  regex: '[0-9]{5}(?:[- ][0-9]{4})?'
}

export const ssn = {
  type: 'regex',
  text: 'SSN',
  regex: '[0-9]{3}-[0-9]{2}-[0-9]{4}'
}
export const email = {
  type: 'regex',
  text: 'E-mail',
  regex: '.+@.+\..+'
}

export const vin = {
  type: 'regex',
  text: 'VIN',
  regex: '[A-HJ-NPR-Z0-9]{10,17}' // this is very basic, but it is enough to validate a little
}

export const validators = [zip, email, ssn, vin]

export const validatorsMap = {
  'VALIDATORS_ZIP': zip,
  'VALIDATORS_EMAIL': email,
  'VALIDATORS_SSN': ssn,
  'VALIDATORS_VIN': vin
}
