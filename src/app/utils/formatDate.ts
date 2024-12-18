const formatDate = (someDate : Date) : string => {
    const date = new Date(someDate);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}

export default formatDate;