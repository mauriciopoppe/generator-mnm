# <%= slugname %> 

[![npm][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] <% if (config.codeCoverage) { %> [![Coverage Status][coveralls-image]][coveralls-url]<% } %> [![js-standard-style][standard-image]][standard-url]

<%= props.description %>

## Install

```sh
$ npm install --save <%= slugname %>
```

## Usage

```js
var <%= safeSlugname %> = require('<%= slugname %>');
<%= safeSlugname %>('Rainbow');
```
<% if (config.cli) { %>
## CLI
```sh
$ npm install --global <%= slugname %>
```<% } %>

## API

Coming soon...

## License

<%= currentYear %> <%= props.license %> © [<%= props.authorName %>](<%= props.authorUrl %>)

[travis-image]: https://travis-ci.org/<%= props.username %>/<%= slugname %>.svg?branch=master
[travis-url]: https://travis-ci.org/<%= props.username %>/<%= slugname %>
[npm-image]: https://img.shields.io/npm/v/<%= slugname %>.svg?style=flat
[npm-url]: https://npmjs.org/package/<%= slugname %>
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: http://standardjs.com/
[coveralls-image]: https://coveralls.io/repos/<%= props.username %>/<%= slugname %>/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/r/<%= props.username %>/<%= slugname %>
