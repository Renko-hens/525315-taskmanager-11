import BoardComponent from './components/board';
import FilterComponent from './components/filter-menu';
import LoadMoreButtonComponent from './components/load-more-button';
import TaskEditComponent from './components/task-edit';
import TaskComponent from './components/task-card';
import TasksComponent from './components/tasks';
import MenuComponent from './components/menu';
import SortComponent from './components/sort';
import NoTasksComponent from './components/no-task';

import {generateTasks} from './mock/task';
import {generateFilters} from './mock/filter';
import {render, replace, RenderPosition, remove} from "./utils/render";


const TASK_COUNT = 20;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

let currentTaskCardComponent = null;
let currentTaskEditComponent = null;


const replaceTaskToEdit = (taskCardComponent, taskEditComponent) => {
  replace(taskEditComponent, taskCardComponent);
};

const replaceEditToTask = (taskCardComponent, taskEditComponent) => {
  replace(taskCardComponent, taskEditComponent);
};


const renderTask = (taskListElement, task) => {
  // Task and Task-edit
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey && currentTaskCardComponent !== null) {
      replaceEditToTask(currentTaskCardComponent, currentTaskEditComponent);

      document.removeEventListener(`keydown`, escKeyDownHandler);

      currentTaskCardComponent = null;
      currentTaskEditComponent = null;
    }
  };

  // edit button
  const editButtonClickHandler = () => {
    if (currentTaskCardComponent !== null) {
      replaceEditToTask(currentTaskCardComponent, currentTaskEditComponent);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }

    replaceTaskToEdit(taskComponent, taskEditComponent);
    document.addEventListener(`keydown`, escKeyDownHandler);

    currentTaskCardComponent = taskComponent;
    currentTaskEditComponent = taskEditComponent;
  };

  taskComponent.setEditButtonClickHandler(editButtonClickHandler);

  //  edit form
  const editFormClickHandler = (evt) => {
    evt.preventDefault();
    replaceEditToTask(taskComponent, taskEditComponent);

    document.removeEventListener(`keydown`, escKeyDownHandler);

    currentTaskCardComponent = null;
    currentTaskEditComponent = null;
  };

  taskEditComponent.setEditFormClickHandler(editFormClickHandler);

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};


const renderBoard = (boardComponent, tasks) => {
  // no task
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    return;
  }

  // sort
  render(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREEND);

  // tasks
  render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

  // load more button
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  const allHidingTasks = () => {
    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  };

  tasks.slice(0, showingTasksCount)
    .forEach((task) => renderTask(taskListElement, task));

  allHidingTasks();

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

  // render task
  loadMoreButtonComponent.setClickHandler(() => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    allHidingTasks();
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters();

render(siteHeaderElement, new MenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
