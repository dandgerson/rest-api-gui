'use strict';
import './main.scss';

import Loader from '../loader';
import UserList from '../user-list';
import Form from '../form';
import User from '../user';
import Error from '../error';
import ContextMenu from '../context-menu';
import TooltipDelay from '../tooltip';
import Modal from '../modal';
import VerificationModal from '../verification-modal';

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

    this.menuShown = true;
  }
  removeContextMenu() {
    this._contextMenuElem.remove();
    this.menuShown = false;
  }
  renderForm() {
    this.form = new Form();
    this._elem.append(this.form.getElem());
  }
  renderSuccessElem(userData) {
    this._user = new User({
      data: userData, 
      formType: this.form.type
    });
    this._elem.append(this._user.getSuccessElem());
  }
  renderErrorElem(errorData) {
    this._error = new Error({
      data: errorData, 
      formType: this.form.type,
    });
    this._elem.append(this._error.getElem());
  }
  renderSuccessDelete(userName) {
    this._elem.innerHTML = `user: "${userName}" successfully deleted`;
  }
  renderErrorDelete(userName) {
    this._elem.innerHTML = `user: "${userName}" deleting was corrupt by Error`;
  }
  renderSuccessDeleteAllUsers(users) {
    const _template = `
      <ul>
        <% for (let user of users) { %>
          <li> user: "<%-user %>" successfully deleted </li>
        <% } %>
      </ul>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)({users: users}));
  }
  renderErrorDeleteAllUsers(response) {
    this._elem.insertAdjacentHTML('afterBegin', response);
  }
  renderModal(question, trigger) {
    const modal = new Modal({
      question: question,
      trigger: trigger,
    });
    this._elem.append(modal.getElem());
  }
  renderVerificationModal(question, trigger) {
    this.verificationModal = new VerificationModal({
      question: question,
      trigger: trigger,
    });
    this._elem.append(this.verificationModal.getElem());
  }
}