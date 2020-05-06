import LoadMoreButtonComponent from '../components/load-more-button';
import TaskEditComponent from '../components/task-edit';
import TaskComponent from '../components/task-card';
import TasksComponent from '../components/tasks';
import SortComponent, {SortType} from '../components/sort';
import NoTasksComponent from '../components/no-task';
import * as utils from "../utils/render";


const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

let currentTaskCardComponent = null;
let currentTaskEditComponent = null;

const replaceTaskToEdit = (taskCardComponent, taskEditComponent) => {
  utils.replace(taskEditComponent, taskCardComponent);
};

const replaceEditToTask = (taskCardComponent, taskEditComponent) => {
  utils.replace(taskCardComponent, taskEditComponent);
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

  utils.render(taskListElement, taskComponent, utils.RenderPosition.BEFOREEND);
};

// GETSORTEDTASKS
const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

// BOARDCOMPONENT
export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(tasks) {
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      utils.render(container, this._loadMoreButtonComponent, utils.RenderPosition.BEFOREEND);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, showingTasksCount);
        renderTasks(taskListElement, sortedTasks);

        if (showingTasksCount >= tasks.length) {
          utils.remove(this._loadMoreButtonComponent);
        }
      });
    };

    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      utils.render(container, this._noTasksComponent, utils.RenderPosition.BEFOREEND);
      return;
    }

    utils.render(container, this._sortComponent, utils.RenderPosition.BEFOREEND);
    utils.render(container, this._tasksComponent, utils.RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    // load more button
    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));

    renderLoadMoreButton();

    // sortSET
    this._sortComponent.setSortTypeChangeHandler((sortType) => {

      showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);

      utils.remove(this._loadMoreButtonComponent);
      renderLoadMoreButton();
    });
  }
}
