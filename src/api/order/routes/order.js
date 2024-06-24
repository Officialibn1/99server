
'use strict';

/**
* order router
*/



const { createCoreRouter } = require('@strapi/strapi').factories;


module.exports = createCoreRouter('api::order.order', {
    only: ['find', 'create', 'update', 'findOne'],
    config: {
        create: {
            auth: false,
            policies: [],
            middlewares: [],
        },

    },


});

// module.exports = {
//     routes: [
//         {
//             method: "POST",
//             path: "/orders",
//             handler: "order.index",
//         },
//     ],
// };











