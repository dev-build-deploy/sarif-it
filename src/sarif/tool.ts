/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

import * as sarif from "sarif";
import { Rule } from "./rule";
import { ISarif } from "../interfaces";

/** The analysis tool that was run. */
export interface ToolOptions {
  /** The organization or company that produced the tool component. */
  organization?: string;
  /** The tool component version, in whatever format the component natively provides. */
  version?: string;
  /** The absolute URI at which information about this version of the tool component can be found. */
  informationUri?: string;
}

/** The analysis tool that was run. */
export class Tool extends ISarif<sarif.Tool> {
  //private _data: sarif.Tool;

  constructor(name: string, options: ToolOptions = {}) {
    super ({
      driver: {
        name: name,
        ...options
      }
    })
  }

  /** The name of the tool component. */
  name(name: string) {
    this._data.driver.name = name;
    return this;
  }

  /** The organization or company that produced the tool component. */
  organization(organization: string) {
    this._data.driver.organization = organization;
    return this;
  }

  /** The tool component version, in whatever format the component natively provides. */
  version(version: string) {
    this._data.driver.version = version;
    return this;
  }

  /** The absolute URI at which information about this version of the tool component can be found. */
  informationUri(informationUri: string) {
    this._data.driver.informationUri = informationUri;
    return this;
  }

  /** Extends the list of rules relevant to the analysis performed by the tool component. */
  addRule(rule: Rule) {
    if (this._data.driver.rules === undefined) {
      this._data.driver.rules = [];
    }

    if (this._data.driver.rules.some(r => r.id === rule.get("id"))) {
      this._data.driver.rules = this._data.driver.rules.filter(r => r.id !== rule.get("id"))  
    }

    this._data.driver.rules.push(rule.properties());
    
    return this;
  }

  /** Getter for a property by name */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override get(property: string): any {
    const properties = Object.keys(this._data.driver as object);
    if (properties.includes(property)) {
      return this._data.driver[property as keyof sarif.ToolComponent];
    }

    throw new Error(`Property '${property}' does not exist.`);
  }
}
