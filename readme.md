# @inshel/suggestions

## Motivation

Predicting user-entered text is one of the most important and frequent tasks.
@inshel/suggestions is a single serverless solution for such tasks both 
in the browser and for bots

## Install

```bash
npm install --save @inshel/suggestions
```

## About

Each sentence contains its own unique token and an unique set of search rated tokens. 

*Example*

```javascript
{
  id: 19283,
  token: 'CATS',
  tokens: [
    { token: 'C', rating: 1000 },
    { token: 'CA', rating: 1000 },
    { token: 'CAT', rating: 1000 },
    { token: 'CATS', rating: 1000 },
  ]
}
```

## Usage

[You can use suggestions, as encrypted storage](./docs/crypted.md)

### upsert

*Params*
- key - key id. Optional (may be specified in options)
- token - string. Required
- rating - integer. Required
- payload - integer. Optional (default: {})
- tokens - tokens array. Optional

Upsert suggestion.  
If suggestion does not exist, it will be created.  
If suggestion exists, tokens rating will be increased

```javascript
const suggestionsWithKey = new Suggestions(node, { key })
const suggestions = new Suggestions(node, { key })
  
const cats = await suggestionsWithKey.upsert('CATS', 1, { isTest: true })
const cats = await suggestions.upsert(key, 'CATS', 2, { isTest: true })
const cats = await suggestions.upsert(key, 'CATS', 3, { isTest: true }, [ 'C', 'CATS' ])
```

*result*

```javascript
{
  id: 19283,
  token: 'CATS',
  tokens: [
    { token: 'C', rating: 6 },
    { token: 'CA', rating: 3 },
    { token: 'CAT', rating: 3 },
    { token: 'CATS', rating: 6 },
  ]
}
```

### upsertMany

Upsert suggestions.  
If suggestion does not exist, it will be created.  
If suggestion exists, tokens rating will be increased

Upsert suggestions.

*Params*
- key - key id. Optional (may be specified in options)
- suggestions - Array of suggestions:
  - token - string. Required
  - rating - integer. Required
  - payload - integer. Optional (default: {})
  - tokens - integer. Optional

```javascript
const suggestionsWithKey = new Suggestions(node, { key })
const suggestions = new Suggestions(node)
  
const [ cats, cat ] = await suggestionsWithKey.upsertMany(
  key,
  [
    { token: 'CATS', rating: 1, payload: { isTest: true }, tokens: [ 'CATS' ] },
    { token: 'CAT', rating: 1, payload: { } }
  ]
)

const [ cats, cat ] = await suggestionsWithKey.upsertMany([
  { token: 'CATS', rating: 1, payload: { isTest: true } },
  { token: 'CAT', rating: 1, payload: { } }
])
```

### q

Returns

*Params*
- key - key id. Optional (may be specified in options)
- q - query string.
- limit - integer. Optional (default options.qLimit)

```javascript
const suggestionsWithKey = new Suggestions(node, { key })
const result = await suggestionsWithKey.q('CA')
const moreResults = await suggestionsWithKey.q('CA', 25)
  
const suggestions = new Suggestions(node)
const result = await suggestions.q(key, 'CA', 12)
```

## Changelog

### 0.1.1

- fix package name

### 0.1.0

First implementation
- upsertMany
- upsert
- q