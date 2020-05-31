import TaskComponent from "../components/task-card";
import TaskEditComponent from "../components/task-edit";
import * as utils from "../utils/render";
import {color} from "../const";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: color.BLACK,
  isFavorite: false,
  isArchive: false,
};

export default class TaskController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;
    this._mode = Mode.DEFAULT;
    this._taskComponent = null;
    this._taskEditComponent = null;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  render(task, mode) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;
    this._mode = mode;

    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    // edit button
    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    this._taskComponent.setArchiveButtonClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    });

    this._taskComponent.setFavoritesButtonClickHandler(() => {
      this._dataChangeHandler(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    });

    //  edit form
    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._taskEditComponent.getData();
      this._dataChangeHandler(this, task, data);
    });
    this._taskEditComponent.setDeleteButtonClickHandler(() => this._dataChangeHandler(this, task, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldTaskEditComponent && oldTaskComponent) {
          utils.replace(this._taskComponent, oldTaskComponent);
          utils.replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          utils.render(this._container, this._taskComponent, utils.RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          utils.remove(oldTaskComponent);
          utils.remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._escKeyDownHandler);
        utils.render(this._container, this._taskEditComponent, utils.RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  destroy() {
    utils.remove(this._taskEditComponent);
    utils.remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._taskEditComponent.reset();

    if (document.contains(this._taskEditComponent.getElement())) {
      utils.replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _replaceTaskToEdit() {
    this._viewChangeHandler();
    utils.replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  _escKeyDownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._dataChangeHandler(this, EmptyTask, null);
      }

      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
