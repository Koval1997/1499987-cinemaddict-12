import Abstract from '../view/abstract.js';
import {RenderPositions} from '../const';

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPositions.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPositions.BEFOREEND:
      container.append(child);
      break;
    case RenderPositions.BEFORE:
      container.before(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (!component) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const appendChild = (container, child) => {
  if (child instanceof Abstract) {
    child = child.getElement();
  }

  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (container === null || child === null) {
    throw new Error(`Can't append unexisting elements`);
  }

  container.appendChild(child);
};
