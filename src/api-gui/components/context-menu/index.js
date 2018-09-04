'use strict';

import './main.scss';

export default class ContextMenu {
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
          <li><a data-id="patchUser" href"#">Patch user</a></li>
          <li><a data-id="deleteUser" href"#">Delete user</a></li>
          <li><a class="warning" data-id="deleteAllUsers" href"#">Delete all users</a></li>
        </ul>
      </div>`;
    this._elem.insertAdjacentHTML('afterbegin', _.template(_template)());
    this._elem = this._elem.firstElementChild;

    this._elem.addEventListener('contextmenu', this);
    this._elem.addEventListener('mousedown', this);
    this._elem.addEventListener('mouseup', this);
  }
  
  onContextmenu() {
    event.preventDefault();
  }
  onMousedown() {
    event.preventDefault();

    if (event.target.classList.contains('caption')) {
      event.target.classList.add('grabbing');

      this._shiftX = event.clientX - this._elem.getBoundingClientRect().left;
      this._shiftY = event.clientY - this._elem.getBoundingClientRect().top;
      
      Object.assign(this._elem.style, {
        position: 'absolute',
        zIndex: 1000,
      });

      this._moveAt(event.pageX, event.pageY);
      document.addEventListener('mousemove', this);
    }
  }

  onMousemove() {
    this._moveAt(event.pageX, event.pageY);
  }
  
  _moveAt(pageX, pageY) {
    Object.assign(this._elem.style, {
      left: pageX - this._shiftX + 'px',
      top: pageY - this._shiftY + 'px',
    });
  }

  onMouseup() {
    event.target.classList.contains('caption') &&
    event.target.classList.remove('grabbing');

    Object.assign(this._elem.style, {
      position: 'fixed',
      zIndex: 999,
    });

    document.removeEventListener('mousemove', this);
  }

  onDragstart() {
    event.preventDefault();
  }
}