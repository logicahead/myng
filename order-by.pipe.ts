import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

   transform(array:Array<any>, args?) {
    // Check if array exists, in this case array contains articles and args is an array that has 1 element : !id
    if(array) {
      // get the first element
      let orderByValue = args[0]
      let orderBy = args[1]
      console.log(orderByValue)
      let byVal = 1
      // check if exclamation point 
      if(!orderBy) {
        // reverse the array
        byVal = -1
       // orderByValue = orderByValue.substr(1)
      }
      console.log("byVal",byVal);
      console.log("orderByValue",orderByValue);

      array.sort(function(a: any, b: any)  {
        console.log(a[orderByValue])
        if(a[orderByValue] < b[orderByValue]) {
          return -1*byVal;
        } else if (a[orderByValue] > b[orderByValue]) {
          return 1*byVal;
        } else {
          return 0;
        }
      });
      return array;
    }
    //
}

}
