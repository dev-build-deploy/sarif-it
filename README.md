<!--
SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
SPDX-License-Identifier: MIT
-->
# SarifIt - Static Analysis Results Interchange Format Builder

Lightweight [SARIF] builder library, allowing your tools to generate unified Code Quality reports.


## Features

* Simple to use
* Wrappers to create SARIF objects
* Compliant with [SARIF 2.1.0]

## Usage

### Define a new Code Quality Analysis tool

```ts
import * as sarif from "@dev-build-deploy/sarif-it";

const tool = new sarif.Tool("code-scanner")
  .organization("dev-build-deploy")
  .version("0.0.0")
  .informationUri("https://github.com/dev-build-deploy/sarif-it#README.md");

const missingDocsRule = new sarif.Rule("MissingDocumentation")
  .name("Missing Documentation")
  .shortDescription("All repositories must contain a README.md containing basic instructions.")
  .fullDescription({
    text: "As documentation is important, we expect all repositories to contain at least a README.md file.",
    markown: "As documentation is *important*, we expect **all** repositories to contain *at least* a `README.md` file."
  })
  .helpUri("https://github.com/dev-build-deploy/sarif-it#README.md");

tool.addRule(missingDocsRule);
```

### Create a Code Quality Analysis report

Assuming that we already have a Code Quality analysis tool defined ([here](#define-a-new-code-quality-analysis-tool));

```ts
import * as sarif from "@dev-build-deploy/sarif-it";

const log = new sarif.Log()
  .addRun(new sarif.Run(tool));  // NOTE: Example for creating a `tool` can be found in the previous chapter

const result = new sarif.Result("Missing Documentation")
  .ruleId("MissingDocumentation")
  .level("error")
  .addLocation({
    physicalLocation: {
      artifactLocation: {
        uri: "./README.md",
      },
    },    
  })

log.get("runs")[0].addResult(result);
```


## Contributing

If you have suggestions for how `sarif-it` could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

- [MIT](./LICENSES/MIT.txt) © 2023 Kevin de Jong \<monkaii@hotmail.com\>


