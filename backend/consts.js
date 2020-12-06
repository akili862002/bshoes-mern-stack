let CONST_FILTER_TARGET = {
    FIVE_STARS: 'FIVE_STARS',
    FOUR_STARS: 'FOUR_STARS',
    THREE_STARS: 'THREE_STARS',
    BOOTS: 'Boots',
    SNEAKERS: 'Sneakers',
    SPORT: 'Sport',
    GREY: 'Grey',
    WHITE: 'White',
    BLACK: 'Black',
    PRICE_UNDER_100: 'Under 100$',
    PRICE_FROM_100_TO_200: '100$ to 200$',
    PRICE_FROM_200_TO_400: '200$ to 400$',
    PRICE_FROM_400_TO_800: '400$ to 800$',
    PRICE_FROM_800_TO_1000: '800$ to 1000$',
    PRICE_ABOVE_1000: 'Above 1000$'
}

let filter_group = {
    star: [
        CONST_FILTER_TARGET.FIVE_STARS, 
        CONST_FILTER_TARGET.FOUR_STARS, 
        CONST_FILTER_TARGET.THREE_STARS
    ],
    typeShoes: [
        CONST_FILTER_TARGET.BOOTS,
        CONST_FILTER_TARGET.SNEAKERS,
        CONST_FILTER_TARGET.SPORT
    ],
    color: [
        CONST_FILTER_TARGET.GREY,
        CONST_FILTER_TARGET.BLACK,
        CONST_FILTER_TARGET.WHITE
    ],
    price: [
        CONST_FILTER_TARGET.PRICE_UNDER_100,
        CONST_FILTER_TARGET.PRICE_FROM_100_TO_200,
        CONST_FILTER_TARGET.PRICE_FROM_200_TO_400,
        CONST_FILTER_TARGET.PRICE_FROM_400_TO_800,
        CONST_FILTER_TARGET.PRICE_FROM_800_TO_1000,
        CONST_FILTER_TARGET.PRICE_ABOVE_1000
    ]
}

let CONST_SORT_TARGET = {
    FEATURED: 'Featured',
    PRICE_LOW_TO_HIGH: 'Price: Low to High',
    PRICE_HIGH_TO_LOW: 'Price: High to Low',
    COSTOMER_REVIEW: 'Costomer Review',
    NEW_PRODUCTS: 'New Products',
    DISCOUNT: 'Discount'
}

let product_card_schema = {
    name: null,
    id_product: null,
    images: {
        smallSize: []
    },
    cost: {
        realCost: null,
        currentCost: null,
        discount: 0
    },
    information: {
        trademark: null,
        describe: null
    },
    rate: {
        star: null,
        NumberPeopleRate: null
    }
}

let initial_filter_target_field = {}

// Set all element in initial_filter_target_field by value of CONST
// It gonna be like this

/* 
initial_filter_target_field = {
    'FIVE_STARS': false,
    ...,
    '100$ to 200$': false,
    ...
}
*/

for (let key of Object.keys(CONST_FILTER_TARGET)) {
    let target_key = CONST_FILTER_TARGET[key]
    initial_filter_target_field[ target_key ] = false;
}

let initial_search_target_field = {}

for (let key of Object.keys(CONST_SORT_TARGET)) {
    let target_key = CONST_SORT_TARGET[key];
    initial_search_target_field[ target_key ] = false;
}
initial_search_target_field[CONST_SORT_TARGET.FEATURED] = true

module.exports = { 
    initial_filter_target_field, 
    initial_search_target_field,
    CONST_FILTER_TARGET,
    CONST_SORT_TARGET,
    product_card_schema,
    filter_group
};