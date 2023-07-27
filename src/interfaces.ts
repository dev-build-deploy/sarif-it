/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */

export abstract class ISarif<T> {
  protected _data: T;

  constructor(data: T) {
    this._data = data;
  }

  /** Getter for a property by name */
  get(property: string) {
    const properties = Object.keys(this._data as object);
    if (properties.includes(property)) {
      return this._data[property as keyof T];
    }

    throw new Error(`Property '${property}' does not exist.`);
  }

  /** Returns all SARIF properties */
  properties(): T {
    return this._data as T;
  }
}
