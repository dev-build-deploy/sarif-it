/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "sarif";
import { Run } from "./run";
import { ISarif } from "../interfaces";

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
}
