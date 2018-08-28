'use strict';

import './main.scss';
import Tooltip from './tooltip';

export default class TooltipDelay extends Tooltip {
  constructor({ sensitivity = 0.1, // speed less than 0.1px/ms means "hovering over an element"
    interval = 100, // measure mouse speed once per 100ms: calculate the distance between previous and next points
  } = {}) {
    super();
    this.sensitivity = sensitivity;
    this.interval = interval;
    //                     this.elem = elem;
    //                     this.over = over;
    //                     this.out = out;
  }
  handleEvent(event) {
    this[`on${event.type[0].toUpperCase() + event.type.slice(1)}`]();
  }
  onMouseover() {
    if (!event.target.closest('[data-tooltip]')) {
      return;
    }
    if (this.isOverElement) {
      // if we're over the element, then ignore the event
      // we are already measuring the speed
      return;
    }
    this._event = event;
    this.elem = event.target.closest('[data-tooltip]');
    this.isOverElement = true;

    this.prevX = event.pageX;
    this.prevY = event.pageY;
    this.prevTime = Date.now();

    this.elem.addEventListener('mousemove', this);

    this.checkSpeedInterval = setInterval(this.trackSpeed.bind(this), this.interval);
  }

  onMouseout() {
    if (!event.target.closest('[data-tooltip]')) {
      return;
    }
    // if left the element
    if (!event.relatedTarget || !this.elem.contains(event.relatedTarget)) {
      this.isOverElement = false;
      this.elem.removeEventListener('mousemove', this);
      clearInterval(this.checkSpeedInterval);
      if (this.isHover) {
        // if there was a stop over the element
        this.hide();
        this.isHover = false;
      }
    }
  }

  onMousemove() {
    this.lastX = event.pageX;
    this.lastY = event.pageY;
    this.lastTime = Date.now();
  }

  trackSpeed() {

    let speed;

    if (!this.lastTime || this.lastTime == this.prevTime) {
      // cursor didn't move
      speed = 0;
    } else {
      speed = Math.sqrt(Math.pow(this.prevX - this.lastX, 2) + Math.pow(this.prevY - this.lastY, 2)) / (this.lastTime - this.prevTime);
    }
    if (speed < this.sensitivity) {
      clearInterval(this.checkSpeedInterval);
      this.isHover = true;
      this.show();
    } else {
      // speed fast, remember new coordinates as the previous ones
      this.prevX = this.lastX;
      this.prevY = this.lastY;
      this.prevTime = this.lastTime;
    }
  }
  render() {

    const event = this._event;
    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
    this.tooltip.innerHTML = event.target.closest('[data-tooltip]').dataset.tooltip;
    document.body.prepend(this.tooltip);

    // let anchorCoords = event.target.closest('[data-tooltip]').getBoundingClientRect();
    // let tooltipCoords = this.tooltip.getBoundingClientRect();
    let top, left, gape;
    gape = 5;
    left = event.pageX + gape;
    top = event.pageY + gape;
    // top = anchorCoords.top - (tooltipCoords.height + gape);
    // if (anchorCoords.top < tooltipCoords.height + gape) {
    //   top = anchorCoords.bottom + gape;
    // }
    // left = (anchorCoords.left + anchorCoords.width / 2) - tooltipCoords.width / 2;
    // if (left < 0) {
    //   left = 0 + gape;
    // }

    Object.assign(this.tooltip.style, {
      top: top + 'px',
      left: left + 'px',
    });
  }
  destroy() {
    this.elem.removeEventListener('mousemove', this);
    this.elem.removeEventListener('mouseover', this);
    this.elem.removeEventListener('mouseout', this);
  }

}