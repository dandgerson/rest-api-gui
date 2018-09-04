'use strict';

import './main.scss';

export default class Error {
  constructor({ data, formType }) {
    this._data = data;
    this._formType = formType;
  }
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    this._formType === 'create' && (this._caption = 'creation');
    this._formType === 'patch' && (this._caption = 'patching');
    let _template = `
      <table >
        <caption>User ${this._caption} was corrupted by Error:</caption>
        <thead>
          <tr>
            <th>Property</th><th>Value</th>
          </tr>
        </thead>
          <tbody>
            <tr><td colspan="2">errors:</td></tr>
          <% for (let error in data) { %>
            <% for (let prop in data[error]) { %>
              <tr class="error">
                <td><%=prop %>:</td><td><%=data[error][prop] %></td>
              </tr>
            <% } %>
          <% } %>
          </tbody>
      </table>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)({data: this._data}));
    this._elem = this._elem.firstElementChild;
  }
}