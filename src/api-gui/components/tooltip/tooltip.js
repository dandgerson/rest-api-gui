'use strict';

export default class Tooltip {
  constructor() {

    document.addEventListener('mouseover', this);
    document.addEventListener('mouseout', this);
  }
  handleEvent(event) {
    this[`on${event.type[0].toUpperCase() + event.type.slice(1)}`]();
  }
  render() {
    this.tooltip = document.createElement('div');
    this.tooltip.classList.add('tooltip');
    this.tooltip.innerHTML = event.target.closest('[data-tooltip]').dataset.tooltip;
    document.body.prepend(this.tooltip);

    let anchorCoords = event.target.closest('[data-tooltip]').getBoundingClientRect();
    let tooltipCoords = this.tooltip.getBoundingClientRect();
    let top, left, gape;
    gape = 5;
    top = anchorCoords.top - (tooltipCoords.height + gape);
    if (anchorCoords.top < tooltipCoords.height + gape) {
      top = anchorCoords.bottom + gape;
    }
    left = (anchorCoords.left + anchorCoords.width / 2) - tooltipCoords.width / 2;

    Object.assign(this.tooltip.style, {
      top: top + 'px',
      left: left + 'px',
    });
  }

  onMouseover() {
    if (!event.target.closest('[data-tooltip]')) {
      return;
    }
    this.show();

  }
  onMouseout() {
    this.hide();
  }
  show() {
    this.render();
  }
  hide() {
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }

  }
}