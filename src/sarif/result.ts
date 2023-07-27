/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from 'sarif';
import { ISarif } from '../interfaces';

export interface ResultOptions {
  /** A value specifying the severity level of the result. */
  level?: "note" | "warning" | "error";
  /** The stable, unique identifier of the rule, if any, to which this result is relevant. */
  ruleId?: string;
}

/** A result produced by an analysis tool. */
export class Result extends ISarif<sarif.Result> {
  /** A result produced by an analysis tool. */
  constructor(message: sarif.MultiformatMessageString | string, options: ResultOptions = {}) {
    const msg = typeof message === "string" ? { text: message } : message;
    super({
      message: msg,
      ...options
    })
  }

  /** The stable, unique identifier of the rule, if any, to which this result is relevant. */
  ruleId(ruleId: string) {
    this._data.ruleId = ruleId;
    return this;
  }

  /** A value specifying the severity level of the result. */
  level(level: "note" | "warning" | "error") {
    this._data.level = level;
    return this;
  }

  /** Encapsulates a message intended to be read by the end user. */
  message(message: sarif.MultiformatMessageString | string) {
    this._data.message = typeof message === "string" ? { text: message } : message;
    return this;
  }

  /** 
   * Extends the set of locations where the result was detected. Specify only one location
   * unless the problem indicated by the result can only be corrected by making a change
   * at every specified location.
   */
  addLocation(location: sarif.Location) {
    if (this._data.locations === undefined) {
      this._data.locations = [];
    }
    this._data.locations.push(location);
    this._data.occurrenceCount = (this._data.occurrenceCount ?? 0) + 1;

    return this;
  }
}
