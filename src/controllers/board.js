import LoadMoreButtonComponent from '../components/load-more-button';
import TaskEditComponent from '../components/task-edit';
import TaskComponent from '../components/task-card';
import TasksComponent from '../components/tasks';
import SortComponent from '../components/sort';
import NoTasksComponent from '../components/no-task';

import {render, replace, RenderPosition, remove} from "../utils/render";

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

// RENDER TASK
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


export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const container = this._container.getElement();

    // no task
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    // sort
    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    // tasks
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    // load more button
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    const allHidingTasks = () => {
      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };

    const taskListElement = this._tasksComponent.getElement();

    tasks.slice(0, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    allHidingTasks();

    render(container, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    // render task
    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));

      allHidingTasks();
    });
  }
}
