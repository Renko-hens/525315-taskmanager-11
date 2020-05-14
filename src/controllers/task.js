import TaskComponent from "../components/task-card";
import TaskEditComponent from "../components/task-edit";
import * as utils from "../utils/render";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(task) {
    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

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
      this._replaceEditToTask();
    });

    if (oldTaskEditComponent && oldTaskComponent) {
      utils.replace(this._taskComponent, oldTaskComponent);
      utils.replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      utils.render(this._container, this._taskComponent, utils.RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._taskEditComponent.reset();
    utils.replace(this._taskComponent, this._taskEditComponent);
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
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }
}
