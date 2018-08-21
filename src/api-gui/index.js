'use strict';

import Validate from './validation';
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
    const _template = `
      <div class="output-pane">
        <span>Output Pane...</span>
      </div>`;
    this._pane = document.createElement('div');
    this._pane.insertAdjacentHTML('afterBegin', _.template(_template)());
    this._pane = this._pane.firstElementChild;

    this._elem.append(this._pane);
  }
  _renderLoader() {
    this._loader = document.createElement('span');
    this._loader.classList.add('loader');
    this._loader.innerHTML = 'loading...';
    this._pane.innerHTML = '';
    this._pane.append(this._loader);
  }
  handleEvent(event) {
    this[`on${event.type[0].toUpperCase() + event.type.slice(1)}`]();
  }
  onClick() {
    if (event.target.hasAttribute('data-button')) {
      const trigger = event.target.dataset.button;
      trigger === 'clear' && this.clearPane();
      trigger === 'showUsers' && this.showUsers();
      trigger === 'createUser' && this.createUser();

    }
  }
  onSubmit() {
    event.preventDefault();
    if (!this._validateForm()){
      return;
    }
    /*
    * тут обработать форму и послать на сервер this._XHR();
    */
    this.showUser();
  }

  clearPane() {
    this._pane.innerHTML = '';
  }

  showUsers() {
    this._renderLoader();
    this._getUsers();
    this._renderUsers();
  }

  _renderUsers() {
    const interval = 2000;
    const intervalId = setInterval(() => {
      if (this._loadEnd) {
        let _template = `
          <% let i = 0; %>
            <table>
              <caption>Users</caption>
              <thead>
                <tr>
                  <th>Property</th><th>Value</th>
                </tr>
              </thead>
              <% for (let user of users) { %>
                <tbody>
                  <tr><td colspan="2">user: <%-++i %></td></tr>
                <% for (let prop in user) { %>
                  <tr>
                      <td><%=prop %>:</td><td><%=user[prop] %></td>
                  </tr>
                <% } %>
                </tbody>
              <% } %>
            </table>`;
        this.clearPane();
        this._pane.insertAdjacentHTML('beforeEnd', _.template(_template)({ users: this.users }));
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

  showUser() {
    this._sendUserData();
    this._renderLoader();
    this.user ? this._renderUser() : this._renderError();
  }

  createUser() {
    this._renderForm();

  }

  _renderForm() {
    const _template = `
      <form>
        <fieldset>
          <legend>Personal user data:</legend>
          fullName: <input type="text" name="fullName" placeholder="Dmitry G. Anderson I" ><br>
          email: <input type="email" name="email" placeholder="dandgerson@gmail.com" ><br>
          avatarUrl: <input type="text" name="avatarUrl" placeholder="https://s.gravatar.com/avatar/48993353f0c5319f31e8250f3f4adab7?s=80"><br>
          birthdate: <input type="text" name="birthdate" placeholder="1988-01-22"><br>
          gender: <input type="text" name="gender" placeholder="'M' or 'F'"><br>
          address: <input type="text" name="address" placeholder="ул.Волжская набережная, Россия, 152903"><br>
          <input type="submit" value="Submit">
        </fieldset>
      </form>`;
    this.clearPane();
    this._pane.insertAdjacentHTML('beforeEnd', _.template(_template)());
    this._pane.addEventListener('submit', this);

  }

  _validateForm() {
    const form = this._pane.querySelector('form');
    const validate = new Validate({
      form: form,
      fields: [
        form.fullName, // первое проверяемое поле
        form.email,
        form.avatarUrl,
        form.birthdate,
        form.gender,
        form.address,
      ],
      conditions: [
        form.fullName.value, // условие для проверки первого поля
        form.email.value,
        form.avatarUrl.value || true,
        form.birthdate.value || true,
        form.gender.value 
        && (form.gender.value === 'M' || form.gender.value === 'F') || true,
        form.address.value || true,
      ],
      errorTexts: [
        ' fullName is required', // текст ошибки для первого поля
        ' email is required',
        ' (optional)',
        ' (optional)',
        ' (optional)',
        ' (optional)',
      ],
      successTexts: [
        ' fullName is ok', // текст успешной проверки для первого поля
        ' email is ok',
        ' (optional)',
        ' (optional)',
        ' (optional)',
        ' (optional)',
      ],
    });
    return validate.result;

  }

  _processForm() {
    const form = this._pane.querySelector('form');
    const elements = form.elements;
    const data = {};
    for (let element of elements) {
      element.name && element.value &&
      (data[element.name] = element.value);
    }
    return data;
  }

  _sendUserData() {
    this.user = this.error = null;
    this._XHR({
      method: 'POST',
      url: this.userUrl + 'users',
      callbackSuccess: xhr => {
        this.user = JSON.parse(xhr.responseText);
      },
      callbackError: xhr => {
        this.error = JSON.parse(xhr.responseText);
      },
      data: this._processForm(),
    });
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

  _XHR({ method, url, callbackSuccess = xhr => {}, callbackError = xhr => {}, data }){
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
