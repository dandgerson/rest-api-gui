'use strict';

import './main.scss';

export default class User {
  constructor({ data, formType }) {
    Object.defineProperties(this, {
      '_data': {
        value: data,
      },
      '_formType': {
        value: formType,
      },
      '_caption': {
        value: null,
        writable: true,
      },
      '_successElem': {
        value: null,
        writable: true,
      }
    });

    for (let prop in this._data) {
      this[prop] = this._data[prop];
    }
  }
  getSuccessElem() {
    this._successElem || (this._successElem = document.createElement('div'));
    this._renderSuccessElem();
    return this._successElem;
  }
  _renderSuccessElem() {
    this._formType === 'create' && (this._caption = 'created');
    this._formType === 'patch' && (this._caption = 'patched');
    let _template = `
      <table>
        <caption>User was successfully ${this._caption}:</caption>
        <thead>
          <tr>
            <th>Property</th><th>Value</th>
          </tr>
        </thead>
          <tbody>
            <tr><td colspan="2">user: <%=data['fullName'] %></td></tr>
          <% for (let prop in data) { %>
            <tr>
                <td><%=prop %>:</td><td><%=data[prop] %></td>
            </tr>
          <% } %>
          </tbody>
      </table>`;
    this._successElem.insertAdjacentHTML('afterBegin', _.template(_template)({data: this._data}));
    this._successElem = this._successElem.firstElementChild;
  }
}