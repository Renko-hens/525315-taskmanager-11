import createMenuTemplate from './components/menu';
import createFilterMenuTemplate from './components/filterMenu';
import createBoardTemplate from './components/board';
import createTaskEditTemplate from './components/taskEdit';
import createTaskCardTemplate from './components/taskCard';
import createLoadMoreButton from './components/loadMoreButton';

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

renderTemplate(siteHeaderElement, createMenuTemplate());
renderTemplate(siteMainElement, createFilterMenuTemplate());
renderTemplate(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(taskListElement, createTaskEditTemplate());

for (let i = 0; i < 3; i++) {
  renderTemplate(taskListElement, createTaskCardTemplate());
}

renderTemplate(boardElement, createLoadMoreButton());
