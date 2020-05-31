import BoardComponent from './components/board';
import BoardController from './controllers/board';
import FilterController from './controllers/filter-menu';
import MenuComponent, {MenuItem} from './components/menu';
import TaskModel from './models/tasks';
import {generateTasks} from './mock/task';
import {render, RenderPosition} from "./utils/render";

const TASK_COUNT = 20;
const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const siteMenuComponent = new MenuComponent();

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);

const tasksModel = new TaskModel();
const tasks = generateTasks(TASK_COUNT);
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

siteMenuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});
