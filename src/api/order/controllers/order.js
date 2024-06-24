// @ts-ignore
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY);

'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
    'api::order.order',
    ({ strapi }) => ({
        async create(ctx) {



            // @ts-ignore
            const { products } = ctx.request.body

            // console.log('Products: ', products)

            const lineItems = await Promise.all(

                products?.map(async (product) => {
                    const item = await strapi.service(`api::product.product`).findOne(product.id)

                    // console.log(item);

                    const serverUrl = `${ctx.protocol}://${ctx.host}`;

                    console.log(serverUrl);

                    const imageUrl = product?.imageUrl ? `${serverUrl}${product?.imageUrl}` : ''

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [imageUrl]
                            },
                            unit_amount: item.price * 100,
                        },
                        quantity: product.quantity
                    }
                })
            )

            try {
                const session = await stripe.checkout.sessions.create({
                    mode: 'payment',
                    success_url: `${process.env.CLIENT_URL}?success=true`,
                    cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
                    line_items: lineItems,
                    payment_method_types: ['card']
                });

                await strapi.service(`api::order.order`).create({
                    data: {
                        products,
                        stripe_id: session.id,
                    }
                })

                return {
                    stripeSession: session
                }
            } catch (error) {
                ctx.response.status = 500

                console.log(error);

                return {
                    status: error.statusCode,
                    message: error.message
                }
            }

        },
    })
);

