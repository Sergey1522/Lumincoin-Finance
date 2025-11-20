export class DateFilterManager {
    constructor(currentFilter) {
        this.currentFilter = currentFilter;
        this.setFilter(this.currentFilter);
    }

}