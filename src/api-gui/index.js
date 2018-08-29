'use strict';

import './main.scss';
import Interface from './components/interface';
import Pane from './components/pane';

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
    }
    
    if (this._elem.contains(this._elem.querySelector('.context-menu'))) {
      event.target.closest('.context-menu') || this._pane.removeContextMenu();
      event.target.closest('a') && this._pane.removeContextMenu();
    }
  }
  onDblclick() {
    event.preventDefault();
  }
  onContextmenu() {
    if (!this._pane._menuShown && event.target.hasAttribute('data-id') &&
    event.target.dataset.id === 'contextMenu-trigger') {
      event.preventDefault();
      this._pane.renderContextMenu();
    }
    if (this._pane._menuShown && event.target.hasAttribute('data-id') &&
      event.target.dataset.id === 'contextMenu-trigger') {
      event.preventDefault();
      this._pane.removeContextMenu();
      this._pane.renderContextMenu();
    }
  }
  onSubmit() {
    event.preventDefault();
    if (!this._pane._form.validate()) return;
    this.showUser();
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

    this._elem.addEventListener('submit', this);
  }

  showUser() {
    this._sendUserData();
    this._pane.clear();
    this._pane.renderLoader();
    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
        this._pane.clear();
        this.userData ? this._pane.renderUser(this.userData) : this._pane.renderError(this.errorData);
        this._loadEnd = null;
        clearInterval(intervalId);
      }
    }, interval);
  }

  _getUsers() {
    this._XHR({
      method: 'GET',
      url: this.mainUrl + 'users',
      callbackSuccess: xhr => {
        this.users = JSON.parse(xhr.responseText);
      },
    });
  }

  _sendUserData() {
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
      data: this._pane._form.process(),
    });
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

    (method === 'GET' || method === 'DELETE') && xhr.send();
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    }

  }

}
