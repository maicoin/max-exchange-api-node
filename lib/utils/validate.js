import Schema from 'validate'

function validate (options, schemaOptions) {
  const optionsSchema = new Schema(schemaOptions)

  return optionsSchema.validate(options)
}

export default validate
