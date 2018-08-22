'use strict';

import './main.scss';

export default class User {
  constructor(data) {
    this.data = data;
  }
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
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
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)({data: this.data}));
    this._elem = this._elem.firstElementChild;
  }
}