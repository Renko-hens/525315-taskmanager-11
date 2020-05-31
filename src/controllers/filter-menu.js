import FilterComponent from '../components/filter-menu';
import {FilterType} from '../const';
import {getTasksByFilter} from '../utils/filter';
import * as utils from '../utils/render';

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._tasksModel.setDataChangeHandler(this._dataChangeHandler);
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getTasksAll();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._filterChangeHandler);

    if (oldComponent) {
      utils.replace(this._filterComponent, oldComponent);
    } else {
      utils.render(container, this._filterComponent, utils.RenderPosition.BEFOREEND);
    }
  }

  _filterChangeHandler(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _dataChangeHandler() {
    this.render();
  }
}
