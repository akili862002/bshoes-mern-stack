const {
    CONST_FILTER_TARGET,
    CONST_SORT_TARGET,
} = require('./consts');

function FilterAndSortData(targets, data) {
    let result = data;
    for (let target of targets) {
        // Star filter
        if (target === CONST_FILTER_TARGET.FIVE_STARS) {
            result = result.filter((product) => product.rate.star >= 4.7);
        }
        if (target === CONST_FILTER_TARGET.FOUR_STARS) {
            result = result.filter((product) => product.rate.star >= 4);
        }
        if (target === CONST_FILTER_TARGET.THREE_STARS) {
            result = result.filter((product) => product.rate.star >= 3);
        }
        
        // type shoes - filter
        if (target === CONST_FILTER_TARGET.BOOTS) {
            result = result.filter((product) => product.name.toLowerCase().includes('boot'));
        }
        if (target === CONST_FILTER_TARGET.SNEAKERS) {
            result = result.filter((product) => product.name.toLowerCase().includes('sneaker'));
        }
        if (target === CONST_FILTER_TARGET.SPORT) {
            result = result.filter((product) => {
                for (let item of product.information.dataSheet)
                    if (item.name && item.property.toLowerCase().includes('sport'))
                        return true; 
                return false;
            });
        }

        // Color - filter
        if (target === CONST_FILTER_TARGET.GREY) {
            result = result.filter((product) => product.name.toLowerCase().includes('grey'));
        }
        if (target === CONST_FILTER_TARGET.WHITE) {
            result = result.filter((product) => product.name.toLowerCase().includes('white'));
        }
        if (target === CONST_FILTER_TARGET.BLACK) {
            result = result.filter((product) => product.name.toLowerCase().includes('black'));
        }

        // Price - filter
        if (target === CONST_FILTER_TARGET.PRICE_UNDER_100) {
            result = result.filter((product) => product.cost.currentCost <= 100);
        }
        if (target === CONST_FILTER_TARGET.PRICE_FROM_100_TO_200) {
            result = result.filter((product) => (100 < product.cost.currentCost && product.cost.currentCost <= 200));
        }
        if (target === CONST_FILTER_TARGET.PRICE_FROM_200_TO_400) {
            result = result.filter((product) => (200 < product.cost.currentCost && product.cost.currentCost <= 400));
        }
        if (target === CONST_FILTER_TARGET.PRICE_FROM_400_TO_800) {
            result = result.filter((product) => (400 < product.cost.currentCost && product.cost.currentCost <= 800));
        }
        if (target === CONST_FILTER_TARGET.PRICE_FROM_800_TO_1000) {
            result = result.filter((product) => (800 < product.cost.currentCost && product.cost.currentCost < 1000));
        }
        
        if (target === CONST_FILTER_TARGET.PRICE_UNDER_100) {
            result = result.filter((product) => product.cost.currentCost >= 1000);
        }

        // SORT Handler
        if (target === CONST_SORT_TARGET.FEATURED) {
            // pass
        }
        if (target === CONST_SORT_TARGET.PRICE_LOW_TO_HIGH) {
            result.sort((a, b) => 
                (a.cost.currentCost - b.cost.currentCost) 
            );
        }
        if (target === CONST_SORT_TARGET.PRICE_HIGH_TO_LOW) {
            result.sort((a, b) => 
                (b.cost.currentCost - a.cost.currentCost) 
            );
        }
        if (target === CONST_SORT_TARGET.COSTOMER_REVIEW) {
            result.sort((a, b) => 
                (b.rate.NumberPeopleRate - a.rate.NumberPeopleRate)
            );
        }
        if (target === CONST_SORT_TARGET.DISCOUNT) {
            result.sort((a, b) => 
                (b.cost.discountPersent - a.cost.discountPersent) 
            );
        }
        if (target === CONST_SORT_TARGET.NEW_PRODUCTS) {
            result.sort((a, b) => {
                let dateA = new Date(a.date).getTime();
                let dateB = new Date(b.date).getTime();
                return (dateB - dateA);
            });
        }
        
    }

    return result;
}

module.exports = { FilterAndSortData };