<%
var b = [] 
if (~badges.indexOf('npm')) b.push('[![NPM version][npm-image]][npm-url]')
if (~badges.indexOf('travis')) b.push('[![Build Status][travis-image]][travis-url]')
if (~badges.indexOf('coveralls')) b.push('[![Coveralls Status][coveralls-image]][coveralls-url]')
if (~badges.indexOf('david')) b.push('[![Dependency Status][depstat-image]][depstat-url]')
if (~badges.indexOf('downloads')) b.push('[![Downloads][download-badge]][npm-url]')

var title
if (center) title = '<big>' + name + '</big>'
else title = '# ' + name
%>

<% if (center) { %><div align="center"><% } %>
<%= title %>

<%= b.join('\n') %>
<% if (center) { %></div><% } %>

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
[npm-image]: https://img.shields.io/npm/v/<%= slugName %>.svg?style=flat-square

[travis-url]: https://travis-ci.org/<%= githubAccount %>/<%= slugName %>
[travis-image]: https://img.shields.io/travis/<%= githubAccount %>/<%= slugName %>.svg?style=flat-square

[coveralls-url]: https://coveralls.io/r/<%= githubAccount %>/<%= slugName %>
[coveralls-image]: https://img.shields.io/coveralls/<%= githubAccount %>/<%= slugName %>.svg?style=flat-square

[depstat-url]: https://david-dm.org/<%= githubAccount %>/<%= slugName %>
[depstat-image]: https://david-dm.org/<%= githubAccount %>/<%= slugName %>.svg?style=flat-square
[download-badge]: http://img.shields.io/npm/dm/<%= slugName %>.svg?style=flat-square

