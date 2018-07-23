<a name="MAX"></a>

## MAX
Client interface to commnuicate with MAX exchange Rest API v2.

**Kind**: global class  

* [MAX](#MAX)
    * [new MAX(options)](#new_MAX_new)
    * [.rest(version)](#MAX+rest) ⇒ <code>RestV2</code>

<a name="new_MAX_new"></a>

### new MAX(options)

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| options.accessKey | <code>string</code> | 
| options.secretKey | <code>string</code> | 

<a name="MAX+rest"></a>

### maX.rest(version) ⇒ <code>RestV2</code>
Returns a new Rest API class instance (cached by version)

**Kind**: instance method of [<code>MAX</code>](#MAX)  
**Returns**: <code>RestV2</code> - transport  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| version | <code>number</code> | <code>2</code> | 2 (default) |

