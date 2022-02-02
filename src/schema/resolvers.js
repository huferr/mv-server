const { UserList } = require("../fakeData")

const resolvers = {
    Query: {
        users: () => {
            return UserList;
        },
        user: (parent, args) => {
         const id = Number(args.id);
         const user = UserList[id - 1];
         return user;
        }
    }
}

module.exports = { resolvers };