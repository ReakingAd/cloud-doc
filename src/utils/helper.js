export const flattenArr = (arr) => {
    return arr.reduce( (previousResult,currentEl,currentIndex) => {
        previousResult[ currentEl.id ] = currentEl;
        return previousResult;
    },{})
}

export const objToArr = ( obj ) => {
    return Object.values( obj );
}

export const getParentNode = (node,parentClassName) => {
    let current = node;
    while( current ){
        if( current.classList.contains( parentClassName ) ){
            return current;
        }
        current = current.parentNode
    }
    return false;
}