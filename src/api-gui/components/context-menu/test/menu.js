'use strict';
class ContextMenu {
  handleEvent(event) {
    this[`on${event.type[0].toUpperCase() + event.type.slice(1)}`]();
  }
  getElem() {
    this._elem || (this._elem = document.createElement('div'));
    this._render();
    return this._elem;
  }

  _render() {
    const _template = `
      <div class="context-menu">
        <div class="caption">User context menu</div>
        <ul>
          <li><a data-id="PATCH" href"#">Patch user</a></li>
          <li><a data-id="DELETE user" href"#">Delete user</a></li>
          <li><a class="warning" data-id="DELETE users" href"#">Delete all users</a></li>
        </ul>
      </div>`;
    this._elem.insertAdjacentHTML('afterbegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;

    this._elem.addEventListener('contextmenu', this);
    this._elem.addEventListener('mousedown', this);
    document.addEventListener('click', this);
  }
  onClick() {
    event.target.closest('.context-menu') || this._elem.remove();
  }
  onContextmenu() {
    event.preventDefault();
  }
  onMousedown() {
    event.preventDefault();
  }
}