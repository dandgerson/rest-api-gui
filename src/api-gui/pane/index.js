'use strict';
import Loader from '../loader';
import UserList from '../user-list';

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
    const loader = new Loader();
    this.clear();
    this._elem.append(loader.getElem());
  }
  clear() {
    this._elem.innerHTML = '';
  }
  renderUserList(users) {
    this.userList = new UserList(users);
    this._elem.append(this.userList.getElem());
  }
}