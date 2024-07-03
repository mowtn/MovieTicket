function addOrRemoveValue(array, value) {
    const index = array.indexOf(value)
    const newArray = [...array]
    if (index === -1) {
        newArray.push(value)
    } else {
        newArray.splice(index, 1)
    }
    return newArray
}

const arrayUtil = { addOrRemoveValue }
export default arrayUtil
