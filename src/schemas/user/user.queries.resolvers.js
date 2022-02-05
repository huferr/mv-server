const { UserList } = require("../../fakeData")

const users = () => UserList;

const user = (parent, args) => {

  if (args.id) {
    const id = Number(args.id);
    const user = UserList[id - 1];
    return user; 
  } 

  if (args.nickname) {
      const nickname = String(args.nickname);
      const userByNickname = UserList.find((u) => u.nickname === nickname);
      return userByNickname;
  }
};

const resolvers = {
    Query: {
        users,
        user,
    }
}

module.exports = { resolvers };