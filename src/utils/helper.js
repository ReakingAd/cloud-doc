export const flattenArr = (arr) => {
    return arr.reduce( (previousResult,currentEl,currentIndex) => {
        previousResult[ currentEl.id ] = currentEl;
        return previousResult;
    },{})
}

export const objToArr = ( obj ) => {
    return Object.values( obj );
}