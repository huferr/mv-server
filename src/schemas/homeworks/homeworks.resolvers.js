const { HomeworksList } = require('../../fakeData');

const getAllHomeworks = () => HomeworksList;

const getHomework = (parent, args) => {
if(args.id) {
    const id = Number(args.id);
    const homeworksById = HomeworksList[id - 1];
    return homeworksById;
}

if(args.subject) {
    const subject = String(args.subject);
    const homeworksBySubject = HomeworksList.find((h) => h.subject === subject);
    return homeworksBySubject;
}
}

const resolvers = {
    Query: {
        getAllHomeworks,
        getHomework,
    }
}

module.exports = { resolvers };