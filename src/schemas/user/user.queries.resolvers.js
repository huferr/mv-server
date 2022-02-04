const { UserList } = require("../../fakeData")

const users = () => UserList;

const user = (parent, args) => {
    const id = Number(args.id);
    const user = UserList[id - 1];
    return user;  
};

const resolvers = {
    Query: {
        users,
        user,
    }
}

module.exports = { resolvers };