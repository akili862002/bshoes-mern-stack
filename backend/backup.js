function randomID() {
    return '-' + Math.random().toString(36).substr(2, 9);
}

function findSubObjInArray(subObj, arr) {
    let indexs = [];
    arr.map((Obj, i) => {
        let check = true; // default 
        
        // check every item in subObj to consider is  match or not
        for (let key of Object.keys(subObj)) {
            if (subObj[key] != Obj[key]) {
                check = false;
            }
        }

        if (check === true) 
            indexs.push(i);
    });
        
    return indexs;
}

function isSubObjInArray(subObj, arr) {
    let indexs = findSubObjInArray(subObj, arr);
    if (indexs.length > 0) 
        return true;
    return false;
}


function getIndexOfItemInArrayHaveSameSubObj(subObj, arr) {
    for (let i=0; i < arr.length; i++) {
        let Obj = arr[i];
        // check every item in subObj to consider is  match or not
        for (let key of Object.keys(subObj)) {
            if (subObj[key] == Obj[key]) {
                return i;
            }
        }
    }
    return -1;
}

function getScoreOfSearchTextWithTargetText(input, text) {
    let words = text.split(' ');
    let input_split = input.split(' ');
    let score = 0;
    
    if ( words.includes(input) ) {
        score += 10;
    }
    
    // check that this input_text is head of text
    if ( input == text.substr(0, input.length) ) {
        score += 8;
    }

    // check every word
    let isAllSingleWordInInputExistInWords = true;
    for (let input_word of input_split) {
        if (!words.includes(input_word)) {
            isAllSingleWordInInputExistInWords = false;
        }
    }
    // console.log(`[${isAllSingleWordInInputExistInWords}] - "${text}"`)
    if (isAllSingleWordInInputExistInWords)
        score += 7;

    if (text.includes(input)) {
        score += 2;
        if (input.length > 8)
            score += 12;
    }

    // check that is current input in head of each word of text
    for (let word of words) {
        if ( input == word.substr(0, input.length) ) {
            score += 3;
        }
    }

    return score;
}

function getSuggestionsWithInputText(input, data) {
    // input: String
    // data: Object

    if (input.length == 0)
        return [];

    var listItems = [];
    input = input.toLowerCase();
	for (let key of Object.keys(data)) {
        let text = (data[key].name + ' ' + data[key].information.trademark.replace(/ /g, '-'))
                        .toLowerCase();
        
        let score = getScoreOfSearchTextWithTargetText(input, text);

        data[key].score = score;

        if (score > 0)
            listItems.push(data[key]);
    }
    
    listItems.sort((a, b) => b.score - a.score);

	return listItems;
}

function getProductsByTopic(input, data) {
    // input: String
    // data: Object

    if (input.length == 0)
        return [];

    var listItems = [];
    input = input.toLowerCase();
	for (let key of Object.keys(data)) {
        let item = data[key];
        // console.log(item.information.dataSheet[2]);

        let words = [
            ...item.tags, 
            ...item.information.dataSheet[2].property.split(',')
        ];

        words = words.map(word => word.toLowerCase());

        if (words.includes('women')) words.push('woman');
        if (words.includes('men')) words.push('man');

        if (words.includes(input)) {
            listItems.push(data[key]);
        }

    }

	return listItems;
}

function splitArray(maxItemsOfEachPage, arr) {
    let result = [];
    while (arr.length > maxItemsOfEachPage) {
        let subArr = arr.splice(0, maxItemsOfEachPage);
        result.push(subArr);
    }
    if (arr.length > 0) {
        result.push(arr);
    }
    return result;
}

module.exports = {
    findSubObjInArray,
    isSubObjInArray,
    getIndexOfItemInArrayHaveSameSubObj,
    getSuggestionsWithInputText,
    splitArray,
    getProductsByTopic
}