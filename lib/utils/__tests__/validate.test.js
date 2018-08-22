const validate = require('../validate')

describe('validate', () => {
  test('returns false if query is valid', () => {
    const query = { a: 1 }
    const querySchema = { a: String }
    const errors = validate(query, querySchema)
    expect(errors).toHaveLength(1)
  })

  test('permits query if schema is null or undefined', () => {
    expect(validate({ a: 1 }, null)).toHaveLength(0)
    expect(validate({ a: 1 }, undefined)).toHaveLength(0)
    expect(validate({ a: 1 }, {})).toHaveLength(0)
    expect(validate(null, {})).toHaveLength(0)
    expect(validate(undefined, {})).toHaveLength(0)
  })
})
