function getItem(key) {
    try {
        const value = localStorage.getItem(key)
        return JSON.parse(value)
    } catch (error) {
        return null
    }
}

function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

const localStorageUtil = { getItem, setItem }
export default localStorageUtil
