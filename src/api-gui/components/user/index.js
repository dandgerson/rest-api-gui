'use strict';

import './main.scss';

export default class User {
  constructor(userData) {
    Object.defineProperty(this, 'data', {
      value: userData,
      writable: false,
      configurable: false,
      enumerable: false,
    });
    
    for (let prop in this.data) {
      this[prop] = this.data[prop];
    }
  }
  getSuccessElem() {
    this._successElem || (this._successElem = document.createElement('div'));
    this._renderSuccessElem();
    return this._successElem;
  }
  _renderSuccessElem() {
    let _template = `
      <table>
        <caption>User was successfully created:</caption>
        <thead>
          <tr>
            <th>Property</th><th>Value</th>
          </tr>
        </thead>
          <tbody>
            <tr><td colspan="2">user:</td></tr>
          <% for (let prop in data) { %>
            <tr>
                <td><%=prop %>:</td><td><%=data[prop] %></td>
            </tr>
          <% } %>
          </tbody>
      </table>`;
    this._successElem.insertAdjacentHTML('afterBegin', _.template(_template)({data: this.data}));
    this._successElem = this._successElem.firstElementChild;
  }
}