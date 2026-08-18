interface SortableObject {
  [key: string]: any;
}

//prettier-ignore
export const FilterSearchCrudTablet = (data: Object[], search: string): Object[] => {
   return  data.filter(item => Object.values(item).some(value =>value.toString().toLowerCase().includes(search.toLowerCase())  ) );
  };

//prettier-ignore
export const isSortedAscending = (arr: SortableObject[], key: string): boolean => {
   for (let i = 1; i < arr.length; i++) {
       const prevValue = arr[i - 1][key];
       const currentValue = arr[i][key];

       if (typeof prevValue === 'string' && typeof currentValue === 'string') {
           if (prevValue.localeCompare(currentValue) > 0) {
               return false;
           }
       } else if (typeof prevValue === 'number' && typeof currentValue === 'number') {
           if (prevValue > currentValue) {
               return false;
           }
       } else if (prevValue instanceof Date && currentValue instanceof Date) {
           if (prevValue.getTime() > currentValue.getTime()) {
               return false;
           }
       }
   }
   return true;
}

//prettier-ignore
export const sortArrayByKey = (arr: SortableObject[], key: string): SortableObject[] => {
   if (isSortedAscending(arr, key)) {
       return arr.reverse();
   }

   return arr.sort((a, b) => {
       const valueA = a[key];
       const valueB = b[key];

       if (typeof valueA === 'string' && typeof valueB === 'string') {
           return valueA.localeCompare(valueB);
       } else if (typeof valueA === 'number' && typeof valueB === 'number') {
           return valueA - valueB;
       } else if (valueA instanceof Date && valueB instanceof Date) {
           return valueA.getTime() - valueB.getTime();
       } else {
           return valueA.toString().localeCompare(valueB.toString());
       }
   });
}
