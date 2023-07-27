/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "sarif";
import { Tool } from "./tool";
import { Result } from "./result";
import { ISarif } from "../interfaces";

/** Describes a single run of an analysis tool, and contains the reported output of that run. */
export class Run extends ISarif<sarif.Run>{
  /**
   * Describes a single run of an analysis tool, and contains the reported output of that run.
   * @param tool The tool or tool pipeline that generated the results in this run.
   */
  constructor(tool: Tool) {
    super ({
      tool: tool.properties()
    })
  }

  /**
   * Information about the tool or tool pipeline that generated the results in this run. A run can only
   * contain results produced by a single tool or tool pipeline. A run can aggregate results from multiple
   * log files, as long as context around the tool run (tool command-line arguments and the like) is
   * identical for all aggregated files.
   */
  tool(tool: Tool) {
    this._data.tool = tool.properties();
    return this;
  }

  /** 
   * Extends the set of results contained in an SARIF log. The results array can be omitted when a run
   * is solely exporting rules metadata. It must be present (but may be empty) if a log file represents
   * an actual scan. 
   */
  addResult(result: Result) {
    if (this._data.results === undefined) {
      this._data.results = [];
    }

    for (const item of this._data.results) {
      if (item.message.text === result.properties().message.text) {
        item.locations?.push(...result.properties().locations ?? []);
        item.occurrenceCount = (item.occurrenceCount ?? 1) + (result.properties().occurrenceCount ?? 1);
        return this;
      }
    }

    this._data.results.push(result.properties());
    return this;
  }
}
