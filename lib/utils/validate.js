const Schema = require('validate')

function validate (options, schemaOptions) {
  const optionsSchema = new Schema(schemaOptions)

  return optionsSchema.validate(options)
}

module.exports = validate
