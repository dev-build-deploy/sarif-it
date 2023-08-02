/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "sarif";
import * as fs from "fs";
import { Run } from "./run";
import { ISarif } from "../interfaces";
import { Tool } from "./tool";
import { Result } from "./result";

/** Static Analysis Results Format (SARIF) Version 2.1.0 */
export class Log extends ISarif<sarif.Log> {
  constructor() {
    super({
      $schema: "http://json.schemastore.org/sarif-2.1.0.json",
      version: "2.1.0",
      runs: []
    })
  }
  
  /** 
   * Adds a single run to the SARIF log
   */
  addRun(run: Run) {
    this._data.runs.push(run.properties());
    return this;
  }

  /**
   * Creates a new SARIF log object from a file
   *
   * @param filePath The path to the SARIF file
   * @returns A new SARIF log object
   */
  static fromFile(filePath: string): Log {
    const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
    const log = new Log();

    if (Object.keys(data).includes("runs") && Array.isArray(data.runs)) {
      for (const sarifRun of data.runs) {
        const tool = new Tool(sarifRun.tool.driver.name, sarifRun.tool.driver);
        const run = new Run(tool);
        if (Object.keys(sarifRun).includes("results") && Array.isArray(sarifRun.results)) {
          for (const result of sarifRun.results) {
            const res = new Result(result.message, result);
            run.addResult(res);
          }
        }
        log.addRun(run);
      }
    }

    return log;
  }
}
