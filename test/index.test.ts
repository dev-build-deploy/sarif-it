/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "../src";

describe("Log", () => {
  test("Default", () => {
    const log = new sarif.Log();
    expect(log).toBeInstanceOf(sarif.Log);
    expect(log.properties()).toStrictEqual({
      version: "2.1.0",
      $schema: "http://json.schemastore.org/sarif-2.1.0.json",
      runs: [],
    });
  });

  test("Add Runs", () => {
    const tool = new sarif.Tool("sarif-it-test");

    const log = new sarif.Log().addRun(new sarif.Run(tool)).addRun(new sarif.Run(tool));

    expect(log.properties()).toStrictEqual({
      version: "2.1.0",
      $schema: "http://json.schemastore.org/sarif-2.1.0.json",
      runs: [
        {
          tool: {
            driver: {
              name: "sarif-it-test",
            },
          },
        },
        {
          tool: {
            driver: {
              name: "sarif-it-test",
            },
          },
        },
      ],
    });
  });

  test("Get Property", () => {
    const log = new sarif.Log();
    expect(log.get("version")).toBe("2.1.0");
  });

  test("Get Missing Property", () => {
    const log = new sarif.Log();
    expect(() => { log.get("does-not-exist") }).toThrowError("Property 'does-not-exist' does not exist.");
  });
});

describe("Result", () => {
  test("Default", () => {
    const result = new sarif.Result("test-rule");
    expect(result).toBeInstanceOf(sarif.Result);
    expect(result.properties()).toStrictEqual({
      message: {
        text: "test-rule",
      },
    });
  });

  test("Full", () => {
    const result = new sarif.Result(
      {
        text: "test-rule",
        markdown: "test-rule-formatted",
      },
      {
        level: "warning",
        ruleId: "TestRuleId",
      }
    );
    expect(result).toBeInstanceOf(sarif.Result);
    expect(result.properties()).toStrictEqual({
      message: {
        text: "test-rule",
        markdown: "test-rule-formatted",
      },
      level: "warning",
      ruleId: "TestRuleId",
    });
  });

  test("Property Setters", () => {
    const result = new sarif.Result("test-rule");
    expect(result).toBeInstanceOf(sarif.Result);
    result.level("warning").ruleId("TestRuleId").message({ text: "test-rule", markdown: "test-rule-formatted" });
    expect(result.properties()).toStrictEqual({
      message: {
        text: "test-rule",
        markdown: "test-rule-formatted",
      },
      level: "warning",
      ruleId: "TestRuleId",
    });
    result.message("test-rule");
    expect(result.properties()).toStrictEqual({
      message: {
        text: "test-rule",
      },
      level: "warning",
      ruleId: "TestRuleId",
    });
  });

  test("Add Locations", () => {
    const locationA = {
      physicalLocation: {
        artifactLocation: {
          uri: "./test/index.test.ts",
        },
        region: {
          startLine: 1,
          startColumn: 1,
          endLine: 1,
          endColumn: 10,
          snippet: {
            text: "const result = new sarif.Result('test-rule');",
          },
        },
      },
    };
    const locationB = {
      physicalLocation: {
        artifactLocation: {
          uri: "./test/index.test.ts",
        },
        region: {
          startLine: 3,
          startColumn: 1,
          endLine: 3,
          endColumn: 10,
          snippet: {
            text: "const locationB = {",
          },
        },
      },
    };

    const result = new sarif.Result("test-rule").addLocation(locationA).addLocation(locationB);
    expect(result).toBeInstanceOf(sarif.Result);
    expect(result.properties()).toStrictEqual({
      message: {
        text: "test-rule",
      },
      locations: [
        {
          physicalLocation: {
            artifactLocation: {
              uri: "./test/index.test.ts",
            },
            region: {
              startLine: 1,
              startColumn: 1,
              endLine: 1,
              endColumn: 10,
              snippet: {
                text: "const result = new sarif.Result('test-rule');",
              },
            },
          },
        },
        {
          physicalLocation: {
            artifactLocation: {
              uri: "./test/index.test.ts",
            },
            region: {
              startLine: 3,
              startColumn: 1,
              endLine: 3,
              endColumn: 10,
              snippet: {
                text: "const locationB = {",
              },
            },
          },
        },
      ],
      occurrenceCount: 2,
    });
  });
});

describe("Rule", () => {
  test("Default", () => {
    const rule = new sarif.Rule("test-rule");
    expect(rule).toBeInstanceOf(sarif.Rule);
    expect(rule.properties()).toStrictEqual({
      id: "test-rule",
    });
  });

  test("Short Description", () => {
    const rule = new sarif.Rule("test-rule", { shortDescription: "test-rule-short" });
    expect(rule).toBeInstanceOf(sarif.Rule);
    expect(rule.properties()).toStrictEqual({
      id: "test-rule",
      shortDescription: {
        text: "test-rule-short",
      },
    });
  });

  test("Full Description", () => {
    const rule = new sarif.Rule("test-rule", { fullDescription: "test-rule-full" });
    expect(rule).toBeInstanceOf(sarif.Rule);
    expect(rule.properties()).toStrictEqual({
      id: "test-rule",
      fullDescription: {
        text: "test-rule-full",
      },
    });
  });

  test("Formatted Descriptions", () => {
    const rule = new sarif.Rule("test-rule", {
      shortDescription: { text: "test-rule-short", markdown: "test-rule-short-formatted" },
      fullDescription: { text: "test-rule-full", markdown: "test-rule-full-formatted" },
    });
    expect(rule).toBeInstanceOf(sarif.Rule);
    expect(rule.properties()).toStrictEqual({
      id: "test-rule",
      shortDescription: {
        text: "test-rule-short",
        markdown: "test-rule-short-formatted",
      },
      fullDescription: {
        text: "test-rule-full",
        markdown: "test-rule-full-formatted",
      },
    });
  });

  test("Property Setters", () => {
    const rule = new sarif.Rule("test-rule")
      .helpUri("http://example.com")
      .fullDescription("test-rule-full")
      .shortDescription("test-rule-short")
      .name("test-rule-override");
    expect(rule).toBeInstanceOf(sarif.Rule);
    expect(rule.properties()).toStrictEqual({
      id: "test-rule",
      name: "test-rule-override",
      helpUri: "http://example.com",
      shortDescription: {
        text: "test-rule-short",
      },
      fullDescription: {
        text: "test-rule-full",
      },
    });
  });
});

describe("Run", () => {
  test("Default", () => {
    const tool = new sarif.Tool("sarif-it-test");
    const run = new sarif.Run(tool);
    expect(run).toBeInstanceOf(sarif.Run);
    expect(run.properties()).toStrictEqual({
      tool: {
        driver: {
          name: "sarif-it-test",
        },
      },
    });
  });

  test("Add Results", () => {
    const tool = new sarif.Tool("sarif-it-test");
    const run = new sarif.Run(tool);
    const resultA = new sarif.Result("test-rule-a");
    const resultB = new sarif.Result("test-rule-b");
    run.addResult(resultA).addResult(resultB).addResult(resultA);
    expect(run).toBeInstanceOf(sarif.Run);
    expect(run.properties()).toStrictEqual({
      tool: {
        driver: {
          name: "sarif-it-test",
        },
      },
      results: [
        {
          message: {
            text: "test-rule-a",
          },
          occurrenceCount: 2,
        },
        {
          message: {
            text: "test-rule-b",
          },
        },
      ],
    });
  });
});

describe("Tool", () => {
  test("Default", () => {
    const tool = new sarif.Tool("sarif-it-test");
    expect(tool).toBeInstanceOf(sarif.Tool);
    expect(tool.properties()).toStrictEqual({
      driver: {
        name: "sarif-it-test",
      },
    });
  });

  test("Full", () => {
    const tool = new sarif.Tool("sarif-it-test", {
      informationUri: "http://example.com",
      version: "1.0.0",
      organization: "dev-build-deploy",
    });
    expect(tool).toBeInstanceOf(sarif.Tool);
    expect(tool.properties()).toStrictEqual({
      driver: {
        name: "sarif-it-test",
        informationUri: "http://example.com",
        version: "1.0.0",
        organization: "dev-build-deploy",
      },
    });
  });

  test("Property Setters", () => {
    const tool = new sarif.Tool("sarif-it-test")
      .informationUri("http://example.com")
      .version("1.0.0")
      .organization("dev-build-deploy");
    expect(tool).toBeInstanceOf(sarif.Tool);
    expect(tool.properties()).toStrictEqual({
      driver: {
        name: "sarif-it-test",
        informationUri: "http://example.com",
        version: "1.0.0",
        organization: "dev-build-deploy",
      },
    });
  });

  test("Add Rules", () => {
    const tool = new sarif.Tool("sarif-it-test");
    tool.addRule(new sarif.Rule("test-rule-a")).addRule(new sarif.Rule("test-rule-b")).addRule(new sarif.Rule("test-rule-a"));
    expect(tool).toBeInstanceOf(sarif.Tool);
    expect(tool.properties()).toStrictEqual({
      driver: {
        name: "sarif-it-test",
        rules: [
          {
            id: "test-rule-b",
          },
          {
            id: "test-rule-a",
          },
        ],
      }
    });
  });

  test("Get Property", () => {
    const tool = new sarif.Tool("sarif-it-test").version("1.0.0");
    expect(tool.get("version")).toBe("1.0.0");
  });

  test("Get Missing Property", () => {
    const tool = new sarif.Tool("sarif-it-test");
    expect(() => { tool.get("version") }).toThrowError("Property 'version' does not exist.");
  });
});
