import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], columns: any[]): any {

        return columns
            ? items.filter(item => {
                var isMatch = true;
                for (let column in columns) {
                    if ((item[column].indexOf(columns[column]) !== -1) == false) {
                        var isMatch = false;
                    }
                }
                return isMatch;
            })
            : items;
    }
}