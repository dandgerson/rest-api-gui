'use strict';
import Loader from '../loader';
import UserList from '../user-list';
import User from '../user';
import Error from '../error';
import Form from '../form';

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
    this.clear();
    this._elem.append(this._loader.getElem());
  }
  clear() {
    this._elem.innerHTML = '';
  }
  renderUserList(users) {
    this.userList = new UserList(users);
    this._elem.append(this.userList.getElem());
  }
  renderForm() {
    this.clear();
    this._form = new Form();
    this._elem.append(this._form.getElem());
  }
  renderUser(userData) {
    this.user = new User(userData);
  }
  renderError(errorData) {
    this.error = new Error(errorData);
  }
}