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
import {render, RenderPosition} from "./utils";

const TASK_COUNT = 20;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

let currentTaskCard = null;
let currentTaskEdit = null;


const replaceTaskToEdit = (taskList, taskCard, taskEdit) => {
  taskList.replaceChild(taskEdit, taskCard);
};

const replaceEditToTask = (taskList, taskCard, taskEdit) => {
  taskList.replaceChild(taskCard, taskEdit);
};


const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const taskCardElement = taskComponent.getElement();
  const taskEditElement = taskEditComponent.getElement();


  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey && currentTaskCard !== null) {
      replaceEditToTask(taskListElement, currentTaskCard.getElement(), currentTaskEdit.getElement());

      document.removeEventListener(`keydown`, escKeyDownHandler);

      currentTaskCard = null;
      currentTaskEdit = null;
    }
  };

  const editButton = taskCardElement.querySelector(`.card__btn--edit`);

  editButton.addEventListener(`click`, () => {
    if (currentTaskCard !== null) {
      replaceEditToTask(taskListElement, currentTaskCard.getElement(), currentTaskEdit.getElement());
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }

    replaceTaskToEdit(taskListElement, taskCardElement, taskEditElement);
    document.addEventListener(`keydown`, escKeyDownHandler);

    currentTaskCard = taskComponent;
    currentTaskEdit = taskEditComponent;
  });

  const editForm = taskEditElement.querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask(taskListElement, taskCardElement, taskEditElement);

    document.removeEventListener(`keydown`, escKeyDownHandler);

    currentTaskCard = null;
    currentTaskEdit = null;
  });


  render(taskListElement, taskCardElement, RenderPosition.BEFOREEND);
};


const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

  const deleteLoadMoreButton = () => {
    loadMoreButtonComponent.getElement().remove();
    loadMoreButtonComponent.removeElement();
  };

  const allHidingTasks = () => {
    if (showingTasksCount >= tasks.length) {
      deleteLoadMoreButton();
    }
  };

  for (let i = 0; i < showingTasksCount; i++) {
    if (tasks[i]) {
      renderTask(taskListElement, tasks[i], i);
    }
  }

  allHidingTasks();

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    for (let i = prevTasksCount; i < showingTasksCount; i++) {
      if (tasks[i]) {
        renderTask(taskListElement, tasks[i], i);
      }
    }

    allHidingTasks();
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilters();

render(siteHeaderElement, new MenuComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
