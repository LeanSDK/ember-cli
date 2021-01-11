
leanes-cli
==============================================================================

[![Latest npm release][npm-badge]][npm-badge-url]
[![GitHub Actions CI][github-actions-badge]][github-actions-ci-url]
[![Test Coverage][coveralls-badge]][coveralls-badge-url]
[![Code Climate][codeclimate-badge]][codeclimate-badge-url]

[npm-badge]: https://img.shields.io/npm/v/leanes-cli.svg
[npm-badge-url]: https://www.npmjs.com/package/leanes-cli
[coveralls-badge]: https://img.shields.io/coveralls/LeanSDK/leanes-cli/master.svg
[coveralls-badge-url]: https://coveralls.io/github/LeanSDK/leanes-cli
[codeclimate-badge]: https://codeclimate.com/github/LeanSDK/leanes-cli/badges/gpa.svg
[codeclimate-badge-url]: https://codeclimate.com/github/LeanSDK/leanes-cli
[github-actions-badge]: https://github.com/LeanSDK/leanes-cli/workflows/CI/badge.svg
[github-actions-ci-url]: https://github.com/LeanSDK/leanes-cli/actions?query=workflow%3ACI

The LeanES command line utility.


Features
------------------------------------------------------------------------------

- Asset build pipeline using [Broccoli.js](https://broccoli.build/)
- ES6 transpilation using [Babel](https://babeljs.io/)
- Project structure conventions using ES6 module syntax
- Development server including live-reload and API proxy
- File/Project generator using blueprints
- Unit, Integration and Acceptance test support using
  [Testem](https://github.com/testem/testem)
- Powerful addon system for extensibility


Installation
------------------------------------------------------------------------------

```
npm install -g leanes-cli
```

Usage
------------------------------------------------------------------------------

After installation the `leanes` CLI tool will be available to you. It is the
entrypoint for all the functionality mentioned above.

You can call `leanes <command> --help` to find out more about [all of the
following commands](https://cli.leanes.com/release/basic-use/cli-commands/) or visit <https://cli.leanes.com/release/> to read
the in-depth documentation.


Documentation
------------------------------------------------------------------------------
Please refer to the [CLI guides](https://cli.leanes.com/release/) for help using LeanES CLI.

Contributing
------------------------------------------------------------------------------
Please see the [contributing guidelines](https://github.com/LeanSDK/leanes-cli/blob/master/CONTRIBUTING.md)


Community
------------------------------------------------------------------------------

- Issues: [leanes-cli/issues](https://github.com/LeanSDK/leanes-cli/issues)
- Documentation: [leanes-cli.com](https://cli.leanes.com/release/)



License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE).
