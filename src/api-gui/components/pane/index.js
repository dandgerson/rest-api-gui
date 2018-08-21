'use strict';
import Loader from '../loader';
import UserList from '../user-list';
import Form from '../form';
import User from '../user';
import Error from '../error';

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
  renderUserList(users) {
    this._userList = new UserList(users);
    this._elem.append(this._userList.getElem());
  }
  renderForm() {
    this._form = new Form();
    this._elem.append(this._form.getElem());
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