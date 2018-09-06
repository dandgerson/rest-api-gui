'use strict';

import './main.scss';
import Interface from './components/interface';
import Pane from './components/pane';
import User from './components/user';

export default class ApiGui {
  constructor({ url, account, }) {
    this.url = url;
    this.account = account;
    this._generateMainUrl();
  }

  handleEvent(event) {
    this[`on${event.type[0].toUpperCase() + event.type.slice(1)}`]();
  }
  onClick() {
    if (event.target.hasAttribute('data-button')) {
      const trigger = event.target.dataset.button;
      trigger === 'clear' && this._pane.clear();
      trigger === 'showUsers' && this.showUserList();
      trigger === 'createUser' && this.createUser();

      trigger === 'modal-cancel' && this.cancelModal();
      trigger === 'modal-delete-user-ok' && this.deleteUser();
      trigger === 'modal-delete-all-users-ok' && this.confirmDeletion();
      trigger === 'verification-delete-all-users' && this.deleteAllUsers();
    }

    if (this._elem.contains(this._elem.querySelector('.context-menu'))) {
      event.target.closest('.context-menu') || this._pane.removeContextMenu();
      event.target.closest('a') && this._pane.removeContextMenu();
    }

    if (event.target.hasAttribute('data-id')) {
      const trigger = event.target.dataset.id;
      switch (trigger) {
      case 'patchUser':
        this.patchUser();
        break;
      case 'deleteUser':
        this.showModalDeleteUser();
        break;
      case 'deleteAllUsers':
        this.showModalDeleteUsers();
        break;
      }
    }
  }
  onDblclick() {
    event.preventDefault();
  }
  onContextmenu() {
    if (!this._pane.menuShown && event.target.hasAttribute('data-id') &&
      event.target.dataset.id === 'contextMenu-trigger') {
      event.preventDefault();
      this.user = this.users.get(+event.target.dataset.index);
      this._pane.renderContextMenu();
      return;
    }
    if (this._pane.menuShown && event.target.hasAttribute('data-id') &&
      event.target.dataset.id === 'contextMenu-trigger') {
      event.preventDefault();
      this._pane.removeContextMenu();
      this.user = this.users.get(+event.target.dataset.index);
      this._pane.renderContextMenu();
      return;
    }
  }
  onSubmit() {
    event.preventDefault();
    if (!this._pane.form.validate()) return;
    this.showResponse();
  }

  _generateMainUrl() {
    this.url[this.url.length - 1] === '/' && (this.mainUrl = this.url) || (this.mainUrl = this.url + '/');
    this.account[this.account.length - 1] === '/' && (this.mainUrl += this.account) || (this.mainUrl += this.account + '/');
  }

  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }

  _render() {
    const _template = `
      <div class="container">
        <div class="row">
          <div class="col">
            <h2>REST API GUI</h2>
          </div>
        </div>
      </div>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;
    this._renderInterface();
    this._renderPane();

    this._elem.addEventListener('click', this);
    this._elem.addEventListener('dblclick', this);
    this._elem.addEventListener('submit', this);
  }

  _renderInterface() {
    this._interface = new Interface();
    this._elem.append(this._interface.getElem());
  }

  _renderPane() {
    this._pane = new Pane();
    this._elem.append(this._pane.getElem());
  }


  showUserList() {
    this._getUsers();
    this._pane.clear();
    this._pane.renderLoader();
    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
        this._pane.clear();
        this._pane.renderUserList(this.users);
        this._loadEnd = null;
        clearInterval(intervalId);
      }
    }, interval);

    this._elem.addEventListener('contextmenu', this);
  }

  createUser() {
    this._pane.clear();
    this._pane.renderForm();
    this._pane.form.type = 'create';
  }

  patchUser() {
    this._pane.clear();
    this._pane.renderForm();
    this._pane.form.fill(this.user);
    this._pane.form.type = 'patch';
  }
  deleteUser() {
    this._pane.clear();
    this._XHR({
      method: 'DELETE',
      url: this.mainUrl + 'users/' + this.user._id,
      callbackSuccess: xhr => {
        console.log(xhr.responseText);
        this._pane.renderSuccessDelete(this.user.fullName);
      },
      callbackError: xhr => {
        console.log(xhr.responseText);
        this._pane.renderErrorDelete(this.user.fullName);
      },
    });
  }

  
  deleteAllUsers() {
    if (this._pane.verificationModal.validate()) {
      this._pane.clear();
      const users = this.users.values();
      const names = [];
      for (let user of users) {
        names.push(user.fullName);
        setTimeout(() => {
          this._XHR({
            method: 'DELETE',
            url: this.mainUrl + 'users/' + user._id,
          });
        }, 0);
      }
      this._pane.renderLoader();
      setTimeout(() => {
        this._pane.clear();
        this._pane.renderSuccessDeleteAllUsers(names);
      }, 2000);
    }
  }
  
  confirmDeletion() {
    this.cancelModal();
    this._pane.renderVerificationModal('delete all users', 'verification-delete-all-users');
  }

  cancelModal() {
    this._elem.querySelector('.modal').remove();
  }

  showModalDeleteUser() {
    this._pane.renderModal(`Delete this user: ${this.user.fullName}?`, 'modal-delete-user-ok');
  }
  showModalDeleteUsers() {
    this._pane.renderModal('Delete all users?', 'modal-delete-all-users-ok');
  }

  showResponse() {
    this._sendUserData();
    this._pane.clear();
    this._pane.renderLoader();
    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
        this._pane.clear();
        this.userData
          ? this._pane.renderSuccessElem(this.userData)
          : this._pane.renderErrorElem(this.errorData);
        this._loadEnd = null;
        clearInterval(intervalId);
      }
    }, interval);
  }

  _getUsers() {
    this.users = null;
    this._XHR({
      method: 'GET',
      url: this.mainUrl + 'users',
      callbackSuccess: xhr => {
        const usersData = JSON.parse(xhr.responseText);
        this.users = new Map();
        let index = 0;
        for (let userData of usersData) {
          this.users.set(++index, new User({ data: userData }));
        }
      },
    });
  }

  _sendUserData() {
    if (this._pane.form.type === 'create') {
      this.userData = this.errorData = null;
      this._XHR({
        method: 'POST',
        url: this.mainUrl + 'users',
        callbackSuccess: xhr => {
          this.userData = JSON.parse(xhr.responseText);
        },
        callbackError: xhr => {
          this.errorData = JSON.parse(xhr.responseText);
        },
        data: this._pane.form.process(),
      });
    }

    if (this._pane.form.type === 'patch') {
      this._XHR({
        method: 'PATCH',
        url: this.mainUrl + 'users/' + this.user._id,
        callbackSuccess: xhr => {
          this.userData = JSON.parse(xhr.responseText);
        },
        callbackError: xhr => {
          this.errorData = JSON.parse(xhr.responseText);
        },
        data: this._pane.form.process(),
      });
    }
  }

  _XHR({ method, url, callbackSuccess = xhr => { }, callbackError = xhr => { }, data }) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => {
      this._loadEnd = false;
      if (xhr.status !== 200) {
        console.log(`Error: ${xhr.responseText}`);
        callbackError(xhr);
      } else {
        console.log(`load is Ok: ${xhr.status} : ${xhr.statusText}`);
        callbackSuccess(xhr);
      }
    };
    xhr.onloadend = () => this._loadEnd = true;
    xhr.onerror = () => console.log('Sorry error! Try again later');

    if (method === 'GET' || method === 'DELETE') {
      xhr.send(); 
    }
    if (method === 'POST' || method === 'PATCH') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    }

  }

}
