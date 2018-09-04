'use strict';
import './main.scss';

import Loader from '../loader';
import UserList from '../user-list';
import Form from '../form';
import User from '../user';
import Error from '../error';
import ContextMenu from '../context-menu';
import TooltipDelay from '../tooltip';

export default class Pane {
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    const _template = `
      <div class="pane">
        <span>Output Pane...</span>
      </div>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;
  }
  renderLoader() {
    this._loader = new Loader();
    this._elem.append(this._loader.getElem());
  }
  clear() {
    this._elem.innerHTML = '';
  }
  renderUserList(usersData) {
    console.log(usersData);
    this._userList = new UserList(usersData);
    this._elem.append(this._userList.getElem());

    new TooltipDelay({
      interval: 500,
    });
  }
  renderContextMenu() {
    this._contextMenu = new ContextMenu();
    this._contextMenuElem = this._contextMenu.getElem();
    this._elem.append(this._contextMenuElem);

    Object.assign(this._contextMenuElem.style, {
      top: event.clientY + 'px',
      left: event.clientX + 'px',
    });

    this._menuShown = true;
  }
  removeContextMenu() {
    this._contextMenuElem.remove();
    this._menuShown = false;
  }
  renderForm() {
    this._form = new Form();
    this._elem.append(this._form.getElem());
  }
  _getUserData(userDetails) {
    const userData = [];
    // this code generate userData from userDetails;
    return userData;
  }
  renderUser(userData) {
    this._user = new User(userData);
    this._elem.append(this._user.getElem());
  }
  renderError(errorData) {
    this._error = new Error(errorData);
    this._elem.append(this._error.getElem());
  }
}