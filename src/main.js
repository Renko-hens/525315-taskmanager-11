import {createMenuTemplate} from './components/menu';
import {createFilterMenuTemplate} from './components/filter-menu';
import {createBoardTemplate} from './components/board';
import {createSortingTemplate} from './components/sorting';
import {createTaskEditTemplate} from './components/task-edit';
import {createTaskCardTemplate} from './components/task-card';
import {createLoadMoreButton} from './components/load-more-button';

import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter';

const TASK_COUNT = 23;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTemplate = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

renderTemplate(siteHeaderElement, createMenuTemplate());
renderTemplate(siteMainElement, createFilterMenuTemplate(filters));
renderTemplate(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(boardElement, createSortingTemplate(), `afterbegin`);
renderTemplate(taskListElement, createTaskEditTemplate(tasks[0]));

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTasksCount)
  .forEach((task) => renderTemplate(taskListElement, createTaskCardTemplate(task)));


renderTemplate(boardElement, createLoadMoreButton());

const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderTemplate(taskListElement, createTaskCardTemplate(task)));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
