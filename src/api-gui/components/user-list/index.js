'use strict';

import './main.scss';

export default class UserList {
  constructor(users) {
    this.users = users;
  }
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    let _template = `
      <% let i = 0, j = 0; %>
      <table class="user-list">
        <caption>Users</caption>
        <thead>
          <tr>
            <th>Property</th><th>Value</th>
          </tr>
        </thead>
        <% for (let user of users) { %>
          <tbody>
            <tr><td data-id="contextMenu-trigger" data-index="<%-++j %>" data-tooltip="Right click for context menu" colspan="2">user: <%-++i %></td></tr>
          <% for (let prop in user) { %>
            <tr>
                <td><%=prop %>:</td><td><%=user[prop] %></td>
            </tr>
          <% } %>
          </tbody>
        <% } %>
      </table>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)({ users: this.users }));
    this._elem = this._elem.firstElementChild;
  }
}