const Query = {
    hello: (parent, {name}, ctx, info) => `Hello ${name || 'world'}`,
    quantity: () => 1,
    user: () =>{
        return { name: "Luis", lastname: "Roman" }
    }
}

export default Query;