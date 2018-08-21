'use strict';

export default class Error {
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
      <table >
        <caption>User creation was corrupted by Error:</caption>
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
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)({data: this.data}));
    this._elem = this._elem.firstElementChild;
  }
}