const UserList = [
    {
      id: 1,
      nickname: 'hugold',
      mathscore: 1000,
      email: 'hugo@hugo.com',
      homeworks: {
        done: 5,
        undone: 195,
      }
    }, 
    {
      id: 2,
      nickname: 'huferr',
      mathscore: 200,
      email: 'huferr@gmail.com',
      homeworks: {
        done: 10,
        undone: 190,
      }
    },
    {
      id: 3,
      nickname: 'what',
      mathscore: 30,
      email: 'what@gmail.com',
      homeworks: {
        done: 20,
        undone: 180,
      }
    },
    {
      id: 4,
      nickname: 'jao e o pe de taioba',
      mathscore: 500,
      email: 'jao@gmail.com',
      homeworks: {
        done: 120,
        undone: 80,
      }
    }
]

const homeworksList = [
  {
    id: 1,
    subject: 'geometry',
    description: 'blablablablabla',
  },
  {
    id: 2,
    subject: 'algebra',
    description: 'blablablablabla',
  },
  {
    id: 3,
    subject: 'seila',
    description: 'blablablablabla',
  },
  {
    id: 4,
    subject: 'naosei',
    description: 'blablablablabla',
  }
]

module.exports = { UserList, homeworksList };