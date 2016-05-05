# mnm:readme

Creates a README file

Options:

- name (module name)
- description (module description)
- githubAccount
- license
- author
- website
- coverage (Boolean)

Note that you might not need to send any of these options, these options will be gathered from an existing package.json file

Prompting:

- If you don't have a package.json file you will be asked for your githubAccount (to generate correct links for the badges)
- The generators asks for the badges to be included on the README file, the following badges are available: npm, travis, coveralls, david, downloads

```js
this.composeWith('mnm:readme', {
  options: {
    name: 'name',
    description: 'description',
    license: 'MIT',
    author: 'example',
    website: 'example.com'
  }
}, {
  local: require.resolve('generator-mnm/generators/boilerplate')
})
```

From the command line

```sh
yo mnm:readme --name=name --description=description --license=MIT --author=example --website="example.com"
```

Again you could just call `yo mnm:readme` and have all of the options filled
from an existing package.json file

