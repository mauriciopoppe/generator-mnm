<%
var b = [] 
if (~badges.indexOf('npm')) b.push('[![NPM version][npm-image]][npm-url]')
if (~badges.indexOf('travis')) b.push('[![Build Status][travis-image]][travis-url]')
if (~badges.indexOf('codecov')) b.push('[![Codecov Status][codecov-image]][codecov-url]')
if (~badges.indexOf('david')) b.push('[![Dependency Status][depstat-image]][depstat-url]')
if (~badges.indexOf('downloads')) b.push('[![Downloads][download-badge]][npm-url]')
%>

# <%= name %>
<%= b.join('\n') %>

> <%= description %>

## Install

```sh
npm install --save <%= slugName %>
```

## Usage

```js
import <%= camelName %> from "<%= slugName %>"

<%= camelName %>()
```

## License

<%= license %><%= " © [" + authorName + "](" + authorUrl + ")" %>

[npm-url]: https://npmjs.org/package/<%= slugName %>
[npm-image]: https://img.shields.io/npm/v/<%= slugName %>.svg?style=flat

[travis-url]: https://travis-ci.org/<%= githubAccount %>/<%= slugName %>
[travis-image]: https://img.shields.io/travis/<%= githubAccount %>/<%= slugName %>.svg?style=flat

[codecov-url]: https://codecov.io/github/<%= githubAccount %>/<%= slugName %>
[codecov-image]: https://img.shields.io/codecov/c/github/<%= githubAccount %>/<%= slugName %>.svg?style=flat

[depstat-url]: https://david-dm.org/<%= githubAccount %>/<%= slugName %>
[depstat-image]: https://david-dm.org/<%= githubAccount %>/<%= slugName %>.svg?style=flat
[download-badge]: http://img.shields.io/npm/dm/<%= slugName %>.svg?style=flat

