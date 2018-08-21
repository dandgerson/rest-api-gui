'use strict';

import Validate from './components/validation';
import Pane from './components/pane';

/*
* + TODO: 1. outputPane:
* + сделать отдельный рендер outputPane
* + сделать его нередактируемым
* ***********************************
* + TODO: 2. вывод данных:
* + сделать вывод дынных списком (таблицей)
* (deprecated) сделать единый метод method showData(){}; для отображения любых данных.
* ***********************************
* TODO: 3. контекстное меню:
* на таблице, выводящей пользователей, после выполнения showUsers(); при наведении на первую
* строку tbody, отведённого под отдельного user'а ,изменить курсор извещая пользователя, 
* или вывести tooltip, если курсор остановится или замедлится над элементом, что у него 
* есть возможность, нажав правую кнопку мыши на этой строке вызывать контекстное меню со списком
* операций с user'ом.
* TODO: 3.1 сделать метод, отрисовывающий контекстное меню _renderMenu();
* меню должно содержать в себе список операций с пользователем:
* изменить пользователя patchUser();
* удалить пользователя deleteUser();
* ***********************************
* + TODO: 4. создать пользователя
* разработать функционал создания пользователя
* при клике на кнопку Create user в this._pane появляется форма с полями для заполнения
* у формы есть валидация и кнопка submit.
* при прохождении волидации форма отправляется на сервер и this._pane выводит, что пользователь с такими
* параметрами успешно создан, показывая его в таблице.
* ***********************************
* + TODO: 5. сделать кастомный скролбар
* ***********************************
* TODO: 6. сделать универсальный _XHR метод для запросов к серверу.
* он должен уметь отправлять:
* + POST запросы
* + GET запросы
* PATCH запросы
* DELETE запросы
* ***********************************
* TODO: 7. сделать отображение полосы загрузки
* ***********************************
* TODO: 8. выделить сущность юзера в отдельный класс и интегрировать его в приложение
* получить юзера
* удалить юзера
* пропатчить юзера
* ***********************************
*/
export default class ApiGui {
  constructor({ url, account, }) {
    this.url = url;
    this.account = account;
    this._getUserUrl();
  }
  _getUserUrl() {
    this.url[this.url.length - 1] === '/' && (this.userUrl = this.url) || (this.userUrl = this.url + '/');
    this.account[this.account.length - 1] === '/' && (this.userUrl += this.account) || (this.userUrl += this.account + '/');
  }
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }
  _render() {
    const _template = `
      <div class="container">
        <h2>REST API GUI</h2>
        <div class="interface">
          <input type='button' value='Clear' data-button='clear'>
          <input type='button' value='Show users' data-button='showUsers'>
          <input type='button' value='Create user' data-button='createUser'>
        </div>
      </div>`;
    this._elem.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;
    this._renderPane();

    this._elem.addEventListener('click', this);
  }
  _renderPane() {
    this._pane = new Pane();
    this._elem.append(this._pane.getElem());
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
  }
  onSubmit() {
    event.preventDefault();
    if (!this._pane._form.validate()) return;
    /*
    * тут обработать форму и послать на сервер this._XHR();
    */
    this.showUser();
  }

  showUserList() {
    this._pane.renderLoader();
    this._getUsers();

    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
        this._pane.clear();
        this._pane.renderUserList(this.users);
        this._loadEnd = null;
        clearInterval(intervalId);
      }
    }, interval);
  }

  createUser() {
    this._pane.renderForm();
    this._elem.addEventListener('submit', this);

  }

  showUser() {
    this._sendUserData();
    this._pane.renderLoader();
    this.userData ? this._pane.renderUser(this.userData) : this._pane.renderError(this.errorData);
  }

  _renderError() {
    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
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
                <% for (let error in errors) { %>
                  <% for (let prop in errors[error]) { %>
                    <tr class="error">
                      <td><%=prop %>:</td><td><%=errors[error][prop] %></td>
                    </tr>
                  <% } %>
                <% } %>
                </tbody>
            </table>`;
        this.clearPane();
        this._pane.insertAdjacentHTML('beforeEnd', _.template(_template)({ errors: this.error }));
        this._loadEnd = null;
        clearInterval(intervalId);
      }
    }, interval);
  }

  _renderUser() {
    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
        let _template = `
            <table>
              <caption>User was successfully created:</caption>
              <thead>
                <tr>
                  <th>Property</th><th>Value</th>
                </tr>
              </thead>
                <tbody>
                  <tr><td colspan="2">user:</td></tr>
                <% for (let prop in user) { %>
                  <tr>
                      <td><%=prop %>:</td><td><%=user[prop] %></td>
                  </tr>
                <% } %>
                </tbody>
            </table>`;
        this.clearPane();
        this._pane.insertAdjacentHTML('beforeEnd', _.template(_template)({ user: this.user }));
        this._loadEnd = null;
        clearInterval(intervalId);
      }
    }, interval);
  }

  _getUsers() {
    this._XHR({
      method: 'GET',
      url: this.userUrl + 'users',
      callbackSuccess: xhr => {
        this.users = JSON.parse(xhr.responseText);
      },
    });
  }

  _sendUserData() {
    this.userData = this.errorData = null;
    this._XHR({
      method: 'POST',
      url: this.userUrl + 'users',
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

    method === 'GET' && xhr.send();
    if (method === 'POST') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    }

  }

}
