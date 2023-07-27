/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "sarif";
import { ISarif } from "../interfaces";

/**
 * Metadata that describes a specific report produced by the tool, as part of the analysis it provides
 * or its runtime reporting.
 */
export interface RuleOptions {
  /** A report identifier that is understandable to an end user. */
  name?: string;
  /** 
   * A concise description of the report. Should be a single sentence that is understandable when visible
   * space is limited to a single line of text.
   */
  shortDescription?: sarif.MultiformatMessageString | string;
  /** 
   * A description of the report. Should, as far as possible, provide details sufficient to enable resolution
   * of any problem indicated by the result. 
   */
  fullDescription?: sarif.MultiformatMessageString | string;
  /** A URI where the primary documentation for the report can be found. */
  helpUri?: string;
}

/** Metadata that describes a specific report produced by the tool, as part of the analysis it provides or its runtime reporting. */
export class Rule extends ISarif<sarif.ReportingDescriptor> {

  /** Metadata that describes a specific report produced by the tool, as part of the analysis it provides or its runtime reporting. */
  constructor(id: string, options: RuleOptions = {}) {
    const short = typeof options.shortDescription === "string" ? { text: options.shortDescription } : options.shortDescription;
    const full = typeof options.fullDescription === "string" ? { text: options.fullDescription } : options.fullDescription;

    if (short === undefined && full === undefined) {
      super({id: id})
    } else if (short !== undefined && full === undefined) {
      super({
        id: id,
        shortDescription: short
      })
    } else if (short === undefined && full !== undefined) {
      super({
        id: id,
        fullDescription: full
      })
    } else {
      super({
        id: id,
        shortDescription: short,
        fullDescription: full
      })
    }
  }

  /** A report identifier that is understandable to an end user. */
  name(name: string) {
    this._data.name = name;
    return this;
  }

  /** 
   * A concise description of the report. Should be a single sentence that is understandable when visible
   * space is limited to a single line of text.
   */
  shortDescription(shortDescription: sarif.MultiformatMessageString | string) {
    this._data.shortDescription = typeof shortDescription === "string" ? { text: shortDescription } : shortDescription;
    return this;
  }

  /** 
   * A description of the report. Should, as far as possible, provide details sufficient to enable resolution
   * of any problem indicated by the result. 
   */
  fullDescription(fullDescription: sarif.MultiformatMessageString | string) {
    this._data.fullDescription = typeof fullDescription === "string" ? { text: fullDescription } : fullDescription;
    return this;
  }

  /** A URI where the primary documentation for the report can be found. */
  helpUri(helpUri: string) {
    this._data.helpUri = helpUri;
    return this;
  }
}
